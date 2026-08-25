import { z } from 'zod';

export const ValidateCashPickupDtoSchema = z.object({
  transferReference: z.string().min(6, 'Référence de transfert requise'),
  pickupCode: z.string().length(6, 'Code secret de retrait à 6 chiffres requis'),
  beneficiaryIdDocumentNumber: z.string().min(4, 'Numéro de pièce d\'identité du bénéficiaire requis'),
  agentNotes: z.string().optional(),
});

export type ValidateCashPickupDto = z.infer<typeof ValidateCashPickupDtoSchema>;

export const CashPickupVoucherResponseSchema = z.object({
  transferReference: z.string(),
  beneficiaryName: z.string(),
  beneficiaryPhone: z.string(),
  amountMad: z.number(),
  city: z.string(),
  isClaimed: z.boolean(),
  claimedAt: z.string().nullable(),
  createdAt: z.string(),
});

export type CashPickupVoucherResponse = z.infer<typeof CashPickupVoucherResponseSchema>;
