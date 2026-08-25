import { z } from 'zod';
import { Role } from '../enums';

export const RegisterDtoSchema = z.object({
  phoneNumber: z.string().min(8, 'Numéro de téléphone requis').regex(/^\+[1-9]\d{6,14}$/, 'Format international requis (ex: +24107000000)'),
  fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères'),
  countryCode: z.enum(['GA', 'CM', 'CD', 'CF', 'MA']),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  password: z.string().min(12, 'Le mot de passe doit contenir au moins 12 caractères'),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  phoneNumber: z.string().min(8, 'Numéro de téléphone requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const AdminLoginDtoSchema = z.object({
  email: z.string().email('Email valide requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type AdminLoginDto = z.infer<typeof AdminLoginDtoSchema>;

export const RequestOtpDtoSchema = z.object({
  phoneNumber: z.string().min(8, 'Numéro de téléphone requis'),
});

export type RequestOtpDto = z.infer<typeof RequestOtpDtoSchema>;

export const VerifyOtpDtoSchema = z.object({
  phoneNumber: z.string().min(8, 'Numéro de téléphone requis'),
  otpCode: z.string().length(6, 'Le code OTP contient 6 chiffres'),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(40, 'Refresh token invalide'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;
