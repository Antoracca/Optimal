export enum Role {
  CLIENT = 'CLIENT',
  AGENT_RELAIS = 'AGENT_RELAIS',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum KycTier {
  TIER_0 = 'TIER_0', // Non vérifié (Plafond minimal)
  TIER_1 = 'TIER_1', // CNI vérifiée
  TIER_2 = 'TIER_2', // Passeport + Domicile vérifié
}

export enum KycStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DeliveryMethod {
  BANK_TRANSFER = 'BANK_TRANSFER', // Virement bancaire Maroc (ChariBaaS / Aslan)
  CASH_PICKUP = 'CASH_PICKUP',     // Retrait en espèces au guichet / point relais
}

export enum TransferStatus {
  CREATED = 'CREATED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PROCESSING = 'PROCESSING',
  PAYOUT_PENDING = 'PAYOUT_PENDING',
  PAYOUT_COMPLETED = 'PAYOUT_COMPLETED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  ORANGE_MONEY = 'ORANGE_MONEY',
  MTN_MOMO = 'MTN_MOMO',
  MANUAL_COMMERCIAL = 'MANUAL_COMMERCIAL',
}

export enum PayoutProvider {
  CHARI_BAAS = 'CHARI_BAAS',
  ASLAN = 'ASLAN',
  CASH_PICKUP_DESK = 'CASH_PICKUP_DESK',
}

export enum AccountType {
  ASSET = 'ASSET',         // Trésorerie Opérateurs & Comptes Bancaires
  LIABILITY = 'LIABILITY', // Dettes envers bénéficiaires / clients
  EQUITY = 'EQUITY',       // Capitaux propres
  REVENUE = 'REVENUE',     // Commissions de transfert et marges de change
  EXPENSE = 'EXPENSE',     // Frais d'APIs opérateurs
}
