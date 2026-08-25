import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeliveryMethod, PaymentProvider, PayoutProvider, PayoutStatus, Role, TransferStatus } from '@optimal/database';
import { InitiateTransferDto, KYC_LIMITS, SUPPORTED_ORIGIN_COUNTRIES, TransferSummaryResponse } from '@optimal/shared';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RatesService } from '../rates/rates.service';
import { LiquidityService } from '../liquidity/liquidity.service';
import { LedgerService } from '../ledger/ledger.service';
import { AirtelMoneyService } from '../providers/airtel/airtel-money.service';
import { OrangeMoneyService } from '../providers/orange/orange-money.service';
import { MtnMomoService } from '../providers/mtn/mtn-momo.service';
import { PayoutsService } from '../payouts/payouts.service';
import { EncryptionService } from '../security/encryption.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rates: RatesService,
    private readonly liquidity: LiquidityService,
    private readonly ledger: LedgerService,
    private readonly airtel: AirtelMoneyService,
    private readonly orange: OrangeMoneyService,
    private readonly mtn: MtnMomoService,
    private readonly payouts: PayoutsService,
    private readonly encryption: EncryptionService,
    private readonly audit: AuditService,
  ) {}

  async initiateTransfer(userId: string, dto: InitiateTransferDto) {
    const fingerprint = this.fingerprint(dto);
    const existing = await this.prisma.transfer.findUnique({ where: { idempotencyKey: dto.idempotencyKey }, include: { recipient: true } });
    if (existing) {
      if (existing.senderId !== userId || existing.idempotencyFingerprint !== fingerprint) {
        throw new ConflictException('Clé d’idempotence déjà utilisée pour une autre requête');
      }
      return { transfer: this.mapTransferToSummary(existing) };
    }

    const [user, recipient] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      this.prisma.recipient.findFirst({ where: { id: dto.recipientId, userId } }),
    ]);
    if (!recipient) throw new NotFoundException('Bénéficiaire introuvable ou non rattaché à ce compte');
    if (user.isBlocked) throw new BadRequestException('Compte suspendu');
    if (user.countryCode !== dto.sendCountry) throw new BadRequestException('Le pays d’envoi doit correspondre au pays du compte');

    const country = SUPPORTED_ORIGIN_COUNTRIES[dto.sendCountry];
    if (!country.providers.includes(dto.paymentProvider) || dto.paymentProvider === 'MANUAL_COMMERCIAL') {
      throw new BadRequestException('Fournisseur de paiement non autorisé pour ce pays');
    }
    if (!dto.payerPhoneNumber.replace(/\s/g, '').startsWith(country.phonePrefix)) {
      throw new BadRequestException('Le numéro Mobile Money ne correspond pas au pays d’envoi');
    }

    await this.enforceKycLimits(userId, user.kycTier, dto.sendAmount, country.currency);
    const quote = await this.rates.getQuote({ originCountry: dto.sendCountry, amount: dto.sendAmount, isSendingAmount: true, deliveryMethod: dto.deliveryMethod });
    const reference = `OPT-${new Date().getFullYear()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const payoutProvider = dto.deliveryMethod === 'BANK_TRANSFER' ? PayoutProvider.CHARI_BAAS : PayoutProvider.CASH_PICKUP_DESK;

    let transfer;
    try {
      transfer = await this.prisma.transfer.create({
        data: {
          reference,
          idempotencyKey: dto.idempotencyKey,
          idempotencyFingerprint: fingerprint,
          senderId: userId,
          recipientId: recipient.id,
          sendCountry: dto.sendCountry,
          sendCurrency: quote.sendCurrency,
          sendAmount: quote.sendAmount,
          feeAmount: quote.feeAmount,
          totalCharged: quote.totalToPay,
          receiveCurrency: 'MAD',
          receiveAmount: quote.receiveAmount,
          appliedExchangeRate: quote.exchangeRate,
          deliveryMethod: dto.deliveryMethod as DeliveryMethod,
          status: TransferStatus.PAYMENT_PENDING,
          paymentProvider: dto.paymentProvider as PaymentProvider,
          payoutProvider,
          rateLockedUntil: new Date(quote.expiresAt),
        },
        include: { recipient: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') return this.initiateTransfer(userId, dto);
      throw error;
    }

    try {
      const collection = await this.initiateCollection(dto.paymentProvider, {
        transferReference: transfer.reference,
        payerPhoneNumber: dto.payerPhoneNumber,
        amount: quote.totalToPay,
        currency: quote.sendCurrency,
        countryCode: dto.sendCountry,
      });
      await this.prisma.paymentIntent.create({
        data: {
          transferId: transfer.id,
          provider: dto.paymentProvider as PaymentProvider,
          providerTransactionId: collection.providerTransactionId,
          payerPhoneNumber: dto.payerPhoneNumber,
          amount: quote.totalToPay,
          currency: quote.sendCurrency,
          status: collection.status,
          rawRequestPayload: collection.rawResponse || {},
        },
      });
      await this.audit.record({ userId, action: 'TRANSFER_INITIATED', entity: 'Transfer', entityId: transfer.id, details: { reference: transfer.reference } });
      return { transfer: this.mapTransferToSummary(transfer), instructions: collection.instructions, operatorTransactionId: collection.providerTransactionId };
    } catch (error) {
      await this.prisma.transfer.update({ where: { id: transfer.id }, data: { status: TransferStatus.FAILED, failureReason: 'Échec de création de la demande de collecte' } });
      throw new BadRequestException('Impossible d’initier le paiement Mobile Money');
    }
  }

  async handlePaymentConfirmed(reference: string, rawWebhookPayload: unknown) {
    const transfer = await this.prisma.transfer.findUnique({ where: { reference }, include: { recipient: true, paymentIntent: true } });
    if (!transfer) throw new NotFoundException(`Transfert introuvable pour la référence ${reference}`);
    if (!transfer.paymentIntent) throw new BadRequestException('Intent de collecte manquant');

    const payoutIntentId = await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.transfer.updateMany({
        where: { id: transfer.id, status: TransferStatus.PAYMENT_PENDING },
        data: { status: TransferStatus.PROCESSING, version: { increment: 1 } },
      });
      if (claimed.count !== 1) return null;

      await tx.paymentIntent.update({ where: { id: transfer.paymentIntent!.id }, data: { status: 'SUCCESS', rawWebhookPayload } });
      await this.liquidity.creditOriginLiquidity(transfer.sendCountry, transfer.sendCurrency, Number(transfer.totalCharged), tx);
      const sourceAccount = this.collectionAccount(transfer.sendCountry, transfer.paymentProvider);
      const clearingAccount = transfer.sendCurrency === 'CDF' ? '4011-CLEARING-CDF' : '4010-CLEARING-XAF';
      await this.ledger.recordDoubleEntry({ transactionRef: reference, operationKey: `${reference}:collection-principal`, debitAccountCode: sourceAccount, creditAccountCode: clearingAccount, amount: Number(transfer.sendAmount), currency: transfer.sendCurrency, description: `Encaissement principal ${reference}` }, tx);
      if (Number(transfer.feeAmount) > 0) {
        const revenueAccount = transfer.sendCurrency === 'CDF' ? '7011-FEES-REVENUE-CDF' : '7010-FEES-REVENUE-XAF';
        await this.ledger.recordDoubleEntry({ transactionRef: reference, operationKey: `${reference}:collection-fee`, debitAccountCode: sourceAccount, creditAccountCode: revenueAccount, amount: Number(transfer.feeAmount), currency: transfer.sendCurrency, description: `Frais de transfert ${reference}` }, tx);
      }

      if (transfer.deliveryMethod === DeliveryMethod.BANK_TRANSFER) {
        if (!transfer.recipient.bankRib) throw new BadRequestException('RIB chiffré manquant');
        const payout = await tx.payoutIntent.create({
          data: {
            transferId: transfer.id,
            provider: PayoutProvider.CHARI_BAAS,
            idempotencyKey: `payout:${transfer.id}`,
            beneficiaryRib: transfer.recipient.bankRib,
            amountMad: transfer.receiveAmount,
            status: PayoutStatus.CREATED,
          },
        });
        await tx.outboxEvent.create({ data: { topic: 'PAYOUT_REQUESTED', aggregateId: payout.id, payload: { payoutIntentId: payout.id } } });
        return payout.id;
      }

      const otp = crypto.randomInt(100000, 1_000_000).toString();
      const voucher = await tx.cashPickupVoucher.create({
        data: {
          transferId: transfer.id,
          pickupCodeHash: await bcrypt.hash(otp, 12),
          pickupCodeEncrypted: this.encryption.encrypt(otp),
          qrCodeToken: crypto.randomBytes(32).toString('hex'),
          pointRelaisCity: transfer.recipient.city || 'Casablanca',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      await this.liquidity.checkAndReserveLiquidity('MA', 'MAD', Number(transfer.receiveAmount), tx);
      await tx.transfer.update({ where: { id: transfer.id }, data: { status: TransferStatus.PAYOUT_PENDING, version: { increment: 1 } } });
      await tx.outboxEvent.create({ data: { topic: 'CASH_PICKUP_CODE_DELIVERY', aggregateId: voucher.id, payload: { voucherId: voucher.id } } });
      return 'CASH_PICKUP';
    });

    if (!payoutIntentId) return { status: 'ALREADY_PROCESSED' };
    if (payoutIntentId === 'CASH_PICKUP') return { status: 'PAYOUT_PENDING' };
    await this.payouts.submit(payoutIntentId);
    return { status: 'PROCESSING' };
  }

  async handlePayoutCompleted(providerTransferId: string, rawWebhookPayload: unknown) {
    const intent = await this.prisma.payoutIntent.findUnique({ where: { providerTransferId }, include: { transfer: true } });
    if (!intent) throw new NotFoundException('Payout introuvable');
    const completed = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.payoutIntent.updateMany({ where: { id: intent.id, status: PayoutStatus.PENDING }, data: { status: PayoutStatus.COMPLETED, rawWebhookPayload } });
      if (changed.count !== 1) return false;
      await tx.transfer.updateMany({ where: { id: intent.transferId, status: TransferStatus.PAYOUT_PENDING }, data: { status: TransferStatus.COMPLETED, version: { increment: 1 } } });
      await this.liquidity.finalizeLiquidityDebit('MA', 'MAD', Number(intent.amountMad), tx);
      return true;
    });
    return { status: completed ? 'COMPLETED' : 'ALREADY_PROCESSED' };
  }

  async findUserTransfers(userId: string) {
    const transfers = await this.prisma.transfer.findMany({ where: { senderId: userId }, include: { recipient: true }, orderBy: { createdAt: 'desc' } });
    return transfers.map((transfer) => this.mapTransferToSummary(transfer));
  }

  async findByReference(requesterId: string, requesterRole: Role, reference: string) {
    const transfer = await this.prisma.transfer.findUnique({ where: { reference }, include: { recipient: true } });
    if (!transfer) throw new NotFoundException('Transfert introuvable');
    const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(requesterRole);
    if (!isAdmin && transfer.senderId !== requesterId) throw new NotFoundException('Transfert introuvable');
    return this.mapTransferToSummary(transfer);
  }

  private async initiateCollection(provider: PaymentProvider | string, params: { transferReference: string; payerPhoneNumber: string; amount: number; currency: string; countryCode: string }) {
    switch (provider) {
      case PaymentProvider.AIRTEL_MONEY: return this.airtel.initiatePayment(params);
      case PaymentProvider.ORANGE_MONEY: return this.orange.initiatePayment(params);
      case PaymentProvider.MTN_MOMO: return this.mtn.initiatePayment(params);
      default: throw new BadRequestException('Fournisseur de collecte non autorisé');
    }
  }

  private collectionAccount(country: string, provider: PaymentProvider) {
    const accounts: Record<string, string> = {
      'GA:AIRTEL_MONEY': '1010-GABON-AIRTEL',
      'CM:ORANGE_MONEY': '1020-CAMEROUN-ORANGE',
      'CM:MTN_MOMO': '1021-CAMEROUN-MTN',
      'CD:AIRTEL_MONEY': '1030-RDC-AIRTEL',
      'CD:ORANGE_MONEY': '1031-RDC-ORANGE',
      'CF:ORANGE_MONEY': '1022-RCA-ORANGE',
    };
    const account = accounts[`${country}:${provider}`];
    if (!account) throw new BadRequestException('Compte comptable de collecte non configuré');
    return account;
  }

  private async enforceKycLimits(userId: string, tier: string, requestedAmount: number, currency: string) {
    if (currency !== 'XAF') return;
    const limits = KYC_LIMITS[tier as keyof typeof KYC_LIMITS];
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [daily, monthly] = await Promise.all([
      this.prisma.transfer.aggregate({ where: { senderId: userId, createdAt: { gte: dayStart }, status: { notIn: [TransferStatus.FAILED, TransferStatus.CANCELLED] } }, _sum: { sendAmount: true } }),
      this.prisma.transfer.aggregate({ where: { senderId: userId, createdAt: { gte: monthStart }, status: { notIn: [TransferStatus.FAILED, TransferStatus.CANCELLED] } }, _sum: { sendAmount: true } }),
    ]);
    if (Number(daily._sum.sendAmount || 0) + requestedAmount > limits.maxDailyAmountXaf || Number(monthly._sum.sendAmount || 0) + requestedAmount > limits.maxMonthlyAmountXaf) {
      throw new BadRequestException('Plafond KYC de transfert dépassé');
    }
  }

  private fingerprint(dto: InitiateTransferDto) {
    return crypto.createHash('sha256').update(JSON.stringify({ recipientId: dto.recipientId, sendCountry: dto.sendCountry, sendAmount: dto.sendAmount, deliveryMethod: dto.deliveryMethod, paymentProvider: dto.paymentProvider, payerPhoneNumber: dto.payerPhoneNumber })).digest('hex');
  }

  private mapTransferToSummary(transfer: any): TransferSummaryResponse {
    return { id: transfer.id, reference: transfer.reference, status: transfer.status, sendCountry: transfer.sendCountry, sendCurrency: transfer.sendCurrency, sendAmount: Number(transfer.sendAmount), feeAmount: Number(transfer.feeAmount), totalCharged: Number(transfer.totalCharged), receiveCurrency: 'MAD', receiveAmount: Number(transfer.receiveAmount), appliedExchangeRate: Number(transfer.appliedExchangeRate), deliveryMethod: transfer.deliveryMethod, paymentProvider: transfer.paymentProvider, payoutProvider: transfer.payoutProvider, recipientName: transfer.recipient.fullName, recipientPhone: transfer.recipient.phoneNumber, createdAt: transfer.createdAt.toISOString(), rateLockedUntil: transfer.rateLockedUntil.toISOString() };
  }
}
