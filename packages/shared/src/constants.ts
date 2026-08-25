export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  flag: string;
  phonePrefix: string;
  providers: string[];
}

export const SUPPORTED_ORIGIN_COUNTRIES: Record<string, CountryInfo> = {
  GA: {
    code: 'GA',
    name: 'Gabon',
    currency: 'XAF',
    flag: '🇬🇦',
    phonePrefix: '+241',
    providers: ['AIRTEL_MONEY'],
  },
  CM: {
    code: 'CM',
    name: 'Cameroun',
    currency: 'XAF',
    flag: '🇨🇲',
    phonePrefix: '+237',
    providers: ['ORANGE_MONEY', 'MTN_MOMO'],
  },
  CD: {
    code: 'CD',
    name: 'RDC (Congo Kinshasa)',
    currency: 'CDF',
    flag: '🇨🇩',
    phonePrefix: '+243',
    providers: ['AIRTEL_MONEY', 'ORANGE_MONEY'],
  },
  CF: {
    code: 'CF',
    name: 'République Centrafricaine',
    currency: 'XAF',
    flag: '🇨🇫',
    phonePrefix: '+236',
    providers: ['ORANGE_MONEY'],
  },
};

export const DESTINATION_COUNTRY: CountryInfo = {
  code: 'MA',
  name: 'Maroc',
  currency: 'MAD',
  flag: '🇲🇦',
  phonePrefix: '+212',
  providers: ['CHARI_BAAS', 'ASLAN', 'CASH_PICKUP_DESK'],
};

export const KYC_LIMITS = {
  TIER_0: {
    maxDailyAmountXaf: 100_000,
    maxMonthlyAmountXaf: 500_000,
    requiresIdUpload: false,
  },
  TIER_1: {
    maxDailyAmountXaf: 1_000_000,
    maxMonthlyAmountXaf: 5_000_000,
    requiresIdUpload: true,
  },
  TIER_2: {
    maxDailyAmountXaf: 10_000_000,
    maxMonthlyAmountXaf: 50_000_000,
    requiresIdUpload: true,
  },
};

export const MOROCCAN_BANKS = [
  { code: 'AWB', name: 'Attijariwafa Bank' },
  { code: 'BCP', name: 'Banque Populaire (BCP)' },
  { code: 'BOA', name: 'Bank of Africa (BMCE)' },
  { code: 'CIH', name: 'CIH Bank' },
  { code: 'SGMB', name: 'Société Générale Maroc' },
  { code: 'BMCI', name: 'BMCI (BNP Paribas)' },
  { code: 'CDM', name: 'Crédit du Maroc' },
  { code: 'CFG', name: 'CFG Bank' },
  { code: 'ALBARID', name: 'Al Barid Bank' },
];

export const CASH_PICKUP_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Agadir',
  'Fès',
  'Meknès',
  'Oujda',
  'Kénitra',
];
