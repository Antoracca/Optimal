import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@optimal/database';

export interface PostLedgerEntryParams {
  transactionRef: string;
  operationKey: string;
  debitAccountCode: string;
  creditAccountCode: string;
  amount: number;
  currency: string;
  description: string;
}

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Enregistre un mouvement comptable en partie double (Double-Entry Bookkeeping)
   * Débit = Crédit, garantissant l'équilibre parfait du bilan.
   */
  async recordDoubleEntry(params: PostLedgerEntryParams, prismaTx?: Prisma.TransactionClient) {
    const db = prismaTx || this.prisma;

    if (params.amount <= 0) {
      throw new BadRequestException('Le montant comptable doit être strictement positif');
    }

    const alreadyRecorded = await db.ledgerEntry.findUnique({ where: { operationKey: params.operationKey } });
    if (alreadyRecorded) return alreadyRecorded;

    const debitAccount = await db.account.findUnique({
      where: { code: params.debitAccountCode },
    });

    const creditAccount = await db.account.findUnique({
      where: { code: params.creditAccountCode },
    });

    if (!debitAccount || !creditAccount) {
      throw new BadRequestException(
        `Comptes comptables introuvables: Débit=${params.debitAccountCode}, Crédit=${params.creditAccountCode}`,
      );
    }

    if (debitAccount.currency !== params.currency || creditAccount.currency !== params.currency) {
      throw new BadRequestException('Une écriture comptable doit utiliser des comptes dans la même devise');
    }

    // 1. Débiter le compte (Augmente l'actif ou diminue le passif)
    await db.account.update({
      where: { id: debitAccount.id },
      data: {
        balance: {
          increment: params.amount,
        },
      },
    });

    // 2. Créditer le compte
    await db.account.update({
      where: { id: creditAccount.id },
      data: {
        balance: {
          decrement: params.amount,
        },
      },
    });

    // 3. Créer l'écriture immuable
    return db.ledgerEntry.create({
      data: {
        transactionRef: params.transactionRef,
        operationKey: params.operationKey,
        debitAccountId: debitAccount.id,
        creditAccountId: creditAccount.id,
        amount: params.amount,
        currency: params.currency,
        description: params.description,
      },
    });
  }

  async getLedgerEntriesByRef(transactionRef: string) {
    return this.prisma.ledgerEntry.findMany({
      where: { transactionRef },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChartOfAccounts() {
    return this.prisma.account.findMany({
      orderBy: { code: 'asc' },
    });
  }
}
