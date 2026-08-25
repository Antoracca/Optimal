# 🌍 Optimal Remittance - Plateforme Fintech de Transfert d'Argent

Plateforme internationale de transfert d'argent et de compensation financière automatisée reliant l'Afrique Centrale (**Gabon 🇬🇦, Cameroun 🇨🇲, RDC 🇨🇩, RCA 🇨🇫**) au **Maroc 🇲🇦**.

---

## 🏛️ Architecture Technique

```
optimal/
├── apps/
│   ├── backend/         # Cœur API & Orchestrateur Fintech (NestJS + TypeScript)
│   ├── mobile/          # Application Mobile Clients (React Native + Expo)
│   └── admin/           # Dashboard Web d'Administration & Guichet Points Relais (Next.js 19)
├── packages/
│   ├── database/        # Schéma PostgreSQL (Prisma), Migrations, Ledger & Seeds
│   └── shared/          # Types partagés, Enums, Constantes et Schémas Zod
├── docker-compose.yml   # Conteneurs PostgreSQL 16 + Redis pour le développement local
└── README.md
```

---

## ⚙️ Les Piliers Clés du Système

1. **Orchestrateur & Machine d'États (NestJS) :**
   * Cycle de vie complet : `CREATED` ➔ `PAYMENT_PENDING` ➔ `PAYMENT_CONFIRMED` ➔ `PROCESSING` ➔ `PAYOUT_PENDING` ➔ `COMPLETED`.
   * Verrouillage du taux de change (Rate Lock) pendant 15 minutes.
   * Clé d'idempotence (`idempotencyKey`) sur chaque transaction pour bannir les doubles paiements.

2. **Intégration Passerelles :**
   * **Collecte Afrique Centrale :** Airtel Money Gabon/RDC, Orange Money Cameroun/RCA, MTN MoMo Cameroun.
   * **Décaissement Maroc :** API BaaS **ChariBaaS** (Virement automatique vers RIB 24 chiffres) + **Aslan** en secours.
   * **Points Relais Maroc :** Bon de retrait avec code secret OTP à 6 chiffres haché en Argon2/Bcrypt.

3. **Registre Comptable en Partie Double (Double-Entry Ledger) :**
   * Chaque transaction enregistre simultanément un débit et un crédit pour une traçabilité financière absolue ($\sum \text{Débit} = \sum \text{Crédit}$).

4. **Gestion de Trésorerie & Pools de Liquidité :**
   * Séparation stricte entre les pools de collecte (XAF/CDF) et les pools de décaissement (MAD).

5. **Reporting & Reçus :**
   * Génération automatique de rapports Excel journaliers (`ExcelJS`).
   * Reçus officiels PDF (`PDFKit`).

---

## 🚀 Démarrage Rapide en Local

### 1. Démarrer la Base de Données et Redis
```bash
docker compose up -d
```

### 2. Initialiser la Base de Données (Prisma & Seeding)
```bash
npm install
npm run db:push
npm run db:seed
```

### 3. Lancer le Backend NestJS
```bash
npm run dev:backend
```
* **API REST :** `http://localhost:4000/api/v1`
* **Documentation Swagger :** `http://localhost:4000/api/docs`

### 4. Lancer le Dashboard Admin Next.js
```bash
npm run dev:admin
```
* **Portail Web :** `http://localhost:3000`

### 5. Lancer l'Application Mobile Expo
```bash
npm run dev:mobile
```
* Scannez le QR code affiché avec l'application **Expo Go** sur votre iPhone ou Android !

---

## 🔒 Sécurité & Conformité
* Chiffrement en transit (TLS 1.3) et au repos (AES-256 pour les RIBs et KYC).
* Vérification cryptographique des signatures HMAC sur tous les webhooks.
* Audit Log immuable consignant chaque opération sensible.
