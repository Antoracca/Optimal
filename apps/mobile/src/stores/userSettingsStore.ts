import { create } from 'zustand';

export type PaymentCard = {
  id: string;
  cardNumber: string; // Ex: **** **** **** 4242
  cardHolder: string;
  expiry: string; // MM/YY
  brand: 'visa' | 'mastercard';
};

export type MobileMoneyAccount = {
  id: string;
  operator: 'airtel' | 'moov' | 'mtn' | 'orange';
  phoneNumber: string;
  accountName: string;
  countryIso: string;
};

export type BankAccount = {
  id: string;
  bankName: string;
  iban: string;
  accountHolder: string;
};

export type KycStatus = 'unverified' | 'pending' | 'verified';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dialCode: string;
  countryIso: string;
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
};

type UserSettingsState = {
  // ── 1. Informations Personnelles ──
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;

  // ── 2. KYC ShareID ──
  kycStatus: KycStatus;
  documentType: 'passport' | 'cni' | 'residence_permit' | null;
  transferLimit: string;
  submitKyc: (docType: 'passport' | 'cni' | 'residence_permit') => void;

  // ── 3. Moyens de Paiement (Initialisé vide sans fausses données) ──
  savedCards: PaymentCard[];
  savedMobileMoney: MobileMoneyAccount[];
  savedBankAccounts: BankAccount[];
  addCard: (card: Omit<PaymentCard, 'id'>) => void;
  removeCard: (id: string) => void;
  addMobileMoney: (account: Omit<MobileMoneyAccount, 'id'>) => void;
  removeMobileMoney: (id: string) => void;
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  removeBankAccount: (id: string) => void;

  // ── 4. Points de Relais Favoris ──
  favoriteRelayIds: string[];
  toggleFavoriteRelay: (relayId: string) => void;
  isRelayFavorite: (relayId: string) => boolean;

  // ── 5. Sécurité & Biométrie ──
  biometricsEnabled: boolean;
  pinCode: string | null;
  twoFactorEnabled: boolean;
  toggleBiometrics: (enabled: boolean) => void;
  setPinCode: (pin: string) => void;
  toggleTwoFactor: (enabled: boolean) => void;

  // ── 6. Préférences & Notifications ──
  notifications: {
    transfers: boolean;
    promotions: boolean;
    security: boolean;
    exchangeRates: boolean;
  };
  toggleNotification: (key: 'transfers' | 'promotions' | 'security' | 'exchangeRates') => void;
  preferredCurrency: 'MAD' | 'XAF';
  setPreferredCurrency: (curr: 'MAD' | 'XAF') => void;
};

export const useUserSettingsStore = create<UserSettingsState>((set, get) => ({
  // Profil initial (vide et prêt à être rempli)
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dialCode: '+241',
    countryIso: 'GA',
    birthDate: '',
    address: '',
    city: '',
    postalCode: '',
  },
  setProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  // KYC ShareID (Plafond Illimité par défaut pour Optimal)
  kycStatus: 'unverified',
  documentType: null,
  transferLimit: 'Illimité',
  submitKyc: (docType) =>
    set({
      kycStatus: 'pending',
      documentType: docType,
    }),

  // Listes de moyens de paiement initialisées à vide (0 données moquées)
  savedCards: [],
  savedMobileMoney: [],
  savedBankAccounts: [],

  addCard: (card) =>
    set((state) => ({
      savedCards: [...state.savedCards, { ...card, id: `card_${Date.now()}` }],
    })),
  removeCard: (id) =>
    set((state) => ({
      savedCards: state.savedCards.filter((c) => c.id !== id),
    })),

  addMobileMoney: (account) =>
    set((state) => ({
      savedMobileMoney: [...state.savedMobileMoney, { ...account, id: `momo_${Date.now()}` }],
    })),
  removeMobileMoney: (id) =>
    set((state) => ({
      savedMobileMoney: state.savedMobileMoney.filter((m) => m.id !== id),
    })),

  addBankAccount: (bank) =>
    set((state) => ({
      savedBankAccounts: [...state.savedBankAccounts, { ...bank, id: `bank_${Date.now()}` }],
    })),
  removeBankAccount: (id) =>
    set((state) => ({
      savedBankAccounts: state.savedBankAccounts.filter((b) => b.id !== id),
    })),

  // Points de relais favoris (initialisé vide)
  favoriteRelayIds: [],
  toggleFavoriteRelay: (relayId) =>
    set((state) => {
      const exists = state.favoriteRelayIds.includes(relayId);
      return {
        favoriteRelayIds: exists
          ? state.favoriteRelayIds.filter((id) => id !== relayId)
          : [...state.favoriteRelayIds, relayId],
      };
    }),
  isRelayFavorite: (relayId) => get().favoriteRelayIds.includes(relayId),

  // Sécurité (Désactivé par défaut)
  biometricsEnabled: false,
  pinCode: null,
  twoFactorEnabled: false,
  toggleBiometrics: (enabled) => set({ biometricsEnabled: enabled }),
  setPinCode: (pin) => set({ pinCode: pin }),
  toggleTwoFactor: (enabled) => set((state) => ({ twoFactorEnabled: enabled })),

  // Notifications
  notifications: {
    transfers: true,
    promotions: false,
    security: true,
    exchangeRates: true,
  },
  toggleNotification: (key) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [key]: !state.notifications[key],
      },
    })),
  preferredCurrency: 'MAD',
  setPreferredCurrency: (curr) => set({ preferredCurrency: curr }),
}));
