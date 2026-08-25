import { create } from 'zustand';

export type VerificationChannel = 'email' | 'sms';

type RegistrationDraft = {
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  dialCode: string;
  phone: string;
  email: string;
  password: string;
  verificationChannel: VerificationChannel;
  update: (values: Partial<Omit<RegistrationDraft, 'update' | 'reset'>>) => void;
  reset: () => void;
};

const initialDraft = {
  firstName: '',
  lastName: '',
  birthDate: '',
  country: 'Cameroun',
  dialCode: '+237',
  phone: '',
  email: '',
  password: '',
  verificationChannel: 'sms' as VerificationChannel,
};

/**
 * Brouillon en mémoire uniquement : aucune donnée personnelle n'est persistée
 * sur l'appareil tant que le backend d'inscription n'est pas connecté.
 */
export const useRegistrationStore = create<RegistrationDraft>((set) => ({
  ...initialDraft,
  update: (values) => set(values),
  reset: () => set(initialDraft),
}));
