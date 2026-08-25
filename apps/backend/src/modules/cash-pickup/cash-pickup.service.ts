import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateCashPickupDto, TransferStatus, DeliveryMethod, Role } from '@optimal/shared';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class CashPickupService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère un code de retrait secret à 6 chiffres et son hash Argon2/Bcrypt
   */
  async createVoucher(transferId: string, pointRelaisCity: string) {
    // Génère un code aléatoire à 6 chiffres
    const rawOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const pickupCodeHash = await bcrypt.hash(rawOtpCode, 10);
    const qrCodeToken = crypto.randomBytes(24).toString('hex');

    const voucher = await this.prisma.cashPickupVoucher.create({
      data: {
        transferId,
        pickupCodeHash,
        qrCodeToken,
        pointRelaisCity,
      },
    });

    return {
      voucherId: voucher.id,
      rawOtpCode, // Renvoyé uniquement à la création pour transmission SMS / Push au bénéficiaire
      qrCodeToken,
    };
  }

  /**
   * Validation d'un retrait par un agent de guichet au Maroc
   */
  async validatePickup(agentId: string, dto: ValidateCashPickupDto) {
    const agent = await this.prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!agent || (agent.role !== Role.AGENT_RELAIS && agent.role !== Role.ADMIN && agent.role !== Role.SUPER_ADMIN)) {
      throw new UnauthorizedException('Seul un agent de guichet autorisé peut valider un retrait en espèces');
    }

    const transfer = await this.prisma.transfer.findUnique({
      where: { reference: dto.transferReference },
      include: {
        recipient: true,
        cashPickupVoucher: true,
      },
    });

    if (!transfer || !transfer.cashPickupVoucher) {
      throw new NotFoundException('Bon de retrait ou transfert introuvable');
    }

    if (transfer.cashPickupVoucher.isClaimed) {
      throw new BadRequestException('Cet argent a déjà été retiré en agence');
    }

    if (transfer.status !== TransferStatus.PAYOUT_PENDING && transfer.status !== TransferStatus.PROCESSING) {
      throw new BadRequestException(`Statut de transfert invalide pour un retrait: ${transfer.status}`);
    }

    // Vérification du code secret à 6 chiffres
    const isCodeValid = await bcrypt.compare(dto.pickupCode, transfer.cashPickupVoucher.pickupCodeHash);
    if (!isCodeValid) {
      throw new BadRequestException('Code secret de retrait erroné');
    }

    // Validation atomique
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le bon
      await tx.cashPickupVoucher.update({
        where: { id: transfer.cashPickupVoucher!.id },
        data: {
          isClaimed: true,
          claimedAt: now,
          claimedByAgentId: agentId,
        },
      });

      // 2. Clôturer le transfert
      await tx.transfer.update({
        where: { id: transfer.id },
        data: {
          status: TransferStatus.COMPLETED,
        },
      });

      // 3. Débiter la caisse du point relais au Maroc
      await tx.account.update({
        where: { code: '1050-MAROC-CAISSE-RELAIS' },
        data: {
          balance: { decrement: transfer.receiveAmount },
        },
      });

      // 4. Inscrire l'audit
      await tx.auditLog.create({
        data: {
          userId: agentId,
          action: 'CASH_PICKUP_VALIDATED',
          entity: 'Transfer',
          entityId: transfer.id,
          details: {
            reference: transfer.reference,
            amountMad: transfer.receiveAmount,
            beneficiaryName: transfer.recipient.fullName,
            idNumber: dto.beneficiaryIdDocumentNumber,
            notes: dto.agentNotes,
          },
        },
      });
    });

    return {
      success: true,
      message: 'Retrait d\'espèces validé avec succès. Argent remis au client.',
      reference: transfer.reference,
      amountMad: transfer.receiveAmount,
      beneficiary: transfer.recipient.fullName,
      claimedAt: now.toISOString(),
    };
  }

  async getVoucherByRef(reference: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { reference },
      include: {
        recipient: true,
        cashPickupVoucher: true,
      },
    });

    if (!transfer || !transfer.cashPickupVoucher) {
      throw new NotFoundException('Bon de retrait introuvable');
    }

    return {
      transferReference: transfer.reference,
      beneficiaryName: transfer.recipient.fullName,
      beneficiaryPhone: transfer.recipient.phoneNumber,
      amountMad: Number(transfer.receiveAmount),
      city: transfer.cashPickupVoucher.pointRelaisCity,
      isClaimed: transfer.cashPickupVoucher.isClaimed,
      claimedAt: transfer.cashPickupVoucher.claimedAt?.toISOString() || null,
      createdAt: transfer.cashPickupVoucher.createdAt.toISOString(),
    };
  }
}
