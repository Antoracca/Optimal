import { z } from 'zod';
import { DeliveryMethod } from '../enums';

export const CreateRecipientDtoSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet du bénéficiaire est requis'),
  phoneNumber: z.string().min(8, 'Numéro de téléphone requis').regex(/^\+212[5-7]\d{8}$/, 'Numéro marocain valide requis (ex: +212600000000)'),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  bankName: z.string().optional(),
  bankRib: z.string().regex(/^\d{24}$/, 'Le RIB bancaire marocain doit comporter exactement 24 chiffres').optional(),
  city: z.string().optional(),
}).refine(data => {
  if (data.deliveryMethod === DeliveryMethod.BANK_TRANSFER) {
    return !!data.bankRib && !!data.bankName;
  }
  return true;
}, {
  message: 'Le RIB et le nom de la banque sont obligatoires pour un virement bancaire',
  path: ['bankRib'],
});

export type CreateRecipientDto = z.infer<typeof CreateRecipientDtoSchema>;
