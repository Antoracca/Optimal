import { PrismaClient, Role, KycTier, DeliveryMethod, AccountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du Seeding de la base de données Fintech...');

  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
  const agentPasswordHash = await bcrypt.hash('AgentPassword123!', 10);

  // 1. Administrateur
  const admin = await prisma.user.upsert({
    where: { phoneNumber: '+212600000001' },
    update: {},
    create: {
      phoneNumber: '+212600000001',
      email: 'admin@optimal-transfer.com',
      fullName: 'Super Admin Optimal',
      passwordHash,
      countryCode: 'MA',
      role: Role.SUPER_ADMIN,
      kycTier: KycTier.TIER_2,
    },
  });

  // 2. Agents Relais (Casablanca & Rabat)
  await prisma.user.upsert({
    where: { phoneNumber: '+212600000002' },
    update: {},
    create: {
      phoneNumber: '+212600000002',
      email: 'relais.casa@optimal-transfer.com',
      fullName: 'Agent Relais Casablanca Maarif',
      passwordHash: agentPasswordHash,
      countryCode: 'MA',
      role: Role.AGENT_RELAIS,
      kycTier: KycTier.TIER_2,
    },
  });

  await prisma.user.upsert({
    where: { phoneNumber: '+212600000003' },
    update: {},
    create: {
      phoneNumber: '+212600000003',
      email: 'relais.rabat@optimal-transfer.com',
      fullName: 'Agent Relais Rabat Agdal',
      passwordHash: agentPasswordHash,
      countryCode: 'MA',
      role: Role.AGENT_RELAIS,
      kycTier: KycTier.TIER_2,
    },
  });

  // 3. Taux de change initiaux
  // 1 MAD ≈ 62.50 XAF (Exemple: 100 000 XAF ≈ 1 600 MAD)
  // appliedRate: 1 XAF = 0.016000 MAD (avec spread inclus)
  await prisma.exchangeRate.upsert({
    where: { fromCurrency_toCurrency: { fromCurrency: 'XAF', toCurrency: 'MAD' } },
    update: {},
    create: {
      fromCurrency: 'XAF',
      toCurrency: 'MAD',
      marketRate: 0.016500,
      appliedRate: 0.016000,
      spreadPercent: 3.03,
      isActive: true,
      updatedBy: admin.id,
    },
  });

  // RDC: CDF ➔ MAD (1 MAD ≈ 280 CDF)
  await prisma.exchangeRate.upsert({
    where: { fromCurrency_toCurrency: { fromCurrency: 'CDF', toCurrency: 'MAD' } },
    update: {},
    create: {
      fromCurrency: 'CDF',
      toCurrency: 'MAD',
      marketRate: 0.003700,
      appliedRate: 0.003550,
      spreadPercent: 4.05,
      isActive: true,
      updatedBy: admin.id,
    },
  });

  // 4. Grille de frais par pays & mode de livraison
  const feeConfigs = [
    // Gabon - Virement
    { countryCode: 'GA', deliveryMethod: DeliveryMethod.BANK_TRANSFER, minAmount: 1000, maxAmount: 5000000, fixedFee: 1500, percentFee: 1.0 },
    // Gabon - Cash Pickup
    { countryCode: 'GA', deliveryMethod: DeliveryMethod.CASH_PICKUP, minAmount: 1000, maxAmount: 5000000, fixedFee: 2000, percentFee: 1.5 },
    // Cameroun - Virement
    { countryCode: 'CM', deliveryMethod: DeliveryMethod.BANK_TRANSFER, minAmount: 1000, maxAmount: 5000000, fixedFee: 1500, percentFee: 1.0 },
    // Cameroun - Cash Pickup
    { countryCode: 'CM', deliveryMethod: DeliveryMethod.CASH_PICKUP, minAmount: 1000, maxAmount: 5000000, fixedFee: 2000, percentFee: 1.5 },
    // RDC - Virement
    { countryCode: 'CD', deliveryMethod: DeliveryMethod.BANK_TRANSFER, minAmount: 5000, maxAmount: 20000000, fixedFee: 5000, percentFee: 1.2 },
    // RCA - Virement
    { countryCode: 'CF', deliveryMethod: DeliveryMethod.BANK_TRANSFER, minAmount: 1000, maxAmount: 5000000, fixedFee: 1500, percentFee: 1.0 },
  ];

  for (const fee of feeConfigs) {
    await prisma.feeConfiguration.create({ data: fee });
  }

  // 5. Pools de Liquidité initiaux
  const pools = [
    { countryCode: 'GA', currency: 'XAF', availableBalance: 25_000_000, reservedBalance: 0, alertThreshold: 2_000_000 },
    { countryCode: 'CM', currency: 'XAF', availableBalance: 30_000_000, reservedBalance: 0, alertThreshold: 3_000_000 },
    { countryCode: 'CD', currency: 'CDF', availableBalance: 50_000_000, reservedBalance: 0, alertThreshold: 5_000_000 },
    { countryCode: 'CF', currency: 'XAF', availableBalance: 10_000_000, reservedBalance: 0, alertThreshold: 1_000_000 },
    { countryCode: 'MA', currency: 'MAD', availableBalance: 500_000, reservedBalance: 0, alertThreshold: 50_000 },
  ];

  for (const pool of pools) {
    await prisma.liquidityPool.create({ data: pool });
  }

  // 6. Plan Comptable Général (Ledger Double-Entry)
  const accounts = [
    // Actifs (Comptes de Trésorerie)
    { code: '1010-GABON-AIRTEL', name: 'Compte Marchand Airtel Gabon', type: AccountType.ASSET, currency: 'XAF', balance: 25_000_000 },
    { code: '1020-CAMEROUN-ORANGE', name: 'Compte Marchand Orange Cameroun', type: AccountType.ASSET, currency: 'XAF', balance: 15_000_000 },
    { code: '1021-CAMEROUN-MTN', name: 'Compte Marchand MTN Cameroun', type: AccountType.ASSET, currency: 'XAF', balance: 15_000_000 },
    { code: '1030-RDC-AIRTEL', name: 'Compte Marchand Airtel RDC', type: AccountType.ASSET, currency: 'CDF', balance: 50_000_000 },
    { code: '1040-MAROC-CHARIBAAS', name: 'Compte Payout ChariBaaS Maroc', type: AccountType.ASSET, currency: 'MAD', balance: 350_000 },
    { code: '1050-MAROC-CAISSE-RELAIS', name: 'Caisse Espèces Points Relais Maroc', type: AccountType.ASSET, currency: 'MAD', balance: 150_000 },

    // Passifs (Dettes envers Bénéficiaires)
    { code: '4010-CLEARING-TRANSFERS', name: 'Compte de Compensation Transferts en cours', type: AccountType.LIABILITY, currency: 'MAD', balance: 0 },

    // Produits (Revenus)
    { code: '7010-FEES-REVENUE', name: 'Produits des Frais de Transfert', type: AccountType.REVENUE, currency: 'MAD', balance: 0 },
    { code: '7020-FX-SPREAD-REVENUE', name: 'Produits de la Marge de Change', type: AccountType.REVENUE, currency: 'MAD', balance: 0 },
  ];

  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
  }

  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
