import { z } from 'zod';
import { DeliveryMethod, PaymentProvider, PayoutProvider, TransferStatus } from '../enums';

export const InitiateTransferDtoSchema = z.object({
  idempotencyKey: z.string().uuid('Une clé d\'idempotence UUID valide est requise'),
  recipientId: z.string().uuid('ID du bénéficiaire invalide'),
  sendCountry: z.enum(['GA', 'CM', 'CD', 'CF']),
  sendAmount: z.number().positive('Le montant doit être supérieur à zéro'),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  paymentProvider: z.nativeEnum(PaymentProvider),
  payerPhoneNumber: z.string().min(8, 'Numéro de débit Mobile Money requis'),
});

export type InitiateTransferDto = z.infer<typeof InitiateTransferDtoSchema>;

export const TransferSummaryResponseSchema = z.object({
  id: z.string(),
  reference: z.string(),
  status: z.nativeEnum(TransferStatus),
  sendCountry: z.string(),
  sendCurrency: z.string(),
  sendAmount: z.number(),
  feeAmount: z.number(),
  totalCharged: z.number(),
  receiveCurrency: z.literal('MAD'),
  receiveAmount: z.number(),
  appliedExchangeRate: z.number(),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  paymentProvider: z.nativeEnum(PaymentProvider),
  payoutProvider: z.nativeEnum(PayoutProvider),
  recipientName: z.string(),
  recipientPhone: z.string(),
  createdAt: z.string(),
  rateLockedUntil: z.string(),
});

export type TransferSummaryResponse = z.infer<typeof TransferSummaryResponseSchema>;
