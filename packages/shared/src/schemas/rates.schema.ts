import { z } from 'zod';
import { DeliveryMethod } from '../enums';

export const GetQuoteDtoSchema = z.object({
  originCountry: z.enum(['GA', 'CM', 'CD', 'CF']),
  amount: z.number().positive('Le montant doit être supérieur à 0'),
  isSendingAmount: z.boolean().default(true), // true si montant saisi en XAF/CDF, false si en MAD
  deliveryMethod: z.nativeEnum(DeliveryMethod),
});

export type GetQuoteDto = z.infer<typeof GetQuoteDtoSchema>;

export const QuoteResponseSchema = z.object({
  originCountry: z.string(),
  sendCurrency: z.string(),
  sendAmount: z.number(),
  feeAmount: z.number(),
  totalToPay: z.number(),
  receiveCurrency: z.literal('MAD'),
  receiveAmount: z.number(),
  exchangeRate: z.number(),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  rateExpiresInSeconds: z.number(),
  expiresAt: z.string(), // ISO String
});

export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;

export const UpdateExchangeRateDtoSchema = z.object({
  fromCurrency: z.string().min(3),
  toCurrency: z.string().default('MAD'),
  marketRate: z.number().positive(),
  spreadPercent: z.number().min(0).max(20), // Marge en %
});

export type UpdateExchangeRateDto = z.infer<typeof UpdateExchangeRateDtoSchema>;
