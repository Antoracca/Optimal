import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PayoutStatus, TransferStatus } from '@optimal/database';
import { PrismaService } from '../prisma/prisma.service';
import { LiquidityService } from '../liquidity/liquidity.service';
import { ChariBaasService } from '../providers/charibaas/charibaas.service';
import { EncryptionService } from '../security/encryption.service';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly liquidity: LiquidityService,
    private readonly chari: ChariBaasService,
    private readonly encryption: EncryptionService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processPendingPayouts() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      const intents = await this.prisma.payoutIntent.findMany({
        where: { status: PayoutStatus.CREATED },
        select: { id: true },
        take: 25,
        orderBy: { createdAt: 'asc' },
      });
      for (const intent of intents) await this.submit(intent.id);
    } finally {
      this.isRunning = false;
    }
  }

  async submit(intentId: string) {
    const intent = await this.prisma.payoutIntent.findUnique({
      where: { id: intentId },
      include: { transfer: { include: { recipient: true } } },
    });
    if (!intent || intent.status !== PayoutStatus.CREATED) return;

    const claimed = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.payoutIntent.updateMany({
        where: { id: intent.id, status: PayoutStatus.CREATED },
        data: { status: PayoutStatus.SUBMITTING },
      });
      if (changed.count !== 1) return false;
      await this.liquidity.checkAndReserveLiquidity('MA', 'MAD', Number(intent.amountMad), tx);
      return true;
    });
    if (!claimed) return;

    try {
      const result = await this.chari.initiateBankTransfer({
        transferReference: intent.transfer.reference,
        beneficiaryName: intent.transfer.recipient.fullName,
        beneficiaryRib: this.encryption.decrypt(intent.beneficiaryRib),
        beneficiaryPhone: intent.transfer.recipient.phoneNumber,
        amountMad: Number(intent.amountMad),
        idempotencyKey: intent.idempotencyKey,
      });
      await this.prisma.$transaction([
        this.prisma.payoutIntent.update({
          where: { id: intent.id },
          data: { status: PayoutStatus.PENDING, providerTransferId: result.providerTransferId, rawWebhookPayload: result.rawResponse || {} },
        }),
        this.prisma.transfer.update({ where: { id: intent.transferId }, data: { status: TransferStatus.PAYOUT_PENDING, version: { increment: 1 } } }),
      ]);
    } catch (error) {
      // An external timeout is an unknown financial outcome: never automatically resend it.
      const message = error instanceof Error ? error.message : 'Erreur inconnue du fournisseur';
      this.logger.error(`Payout ${intent.id} requires reconciliation: ${message}`);
      await this.prisma.payoutIntent.update({ where: { id: intent.id }, data: { status: PayoutStatus.UNKNOWN } });
    }
  }
}
