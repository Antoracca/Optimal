import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@optimal/database';

@Injectable()
export class LiquidityService {
  constructor(private prisma: PrismaService) {}

  async getAllPools() {
    return this.prisma.liquidityPool.findMany({
      orderBy: { countryCode: 'asc' },
    });
  }

  async checkAndReserveLiquidity(countryCode: string, currency: string, amount: number, prismaTx?: Prisma.TransactionClient) {
    const db = prismaTx || this.prisma;
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('Montant de réservation invalide');
    const result = await db.liquidityPool.updateMany({
      where: { countryCode, currency, availableBalance: { gte: amount } },
      data: { availableBalance: { decrement: amount }, reservedBalance: { increment: amount } },
    });
    if (result.count !== 1) throw new BadRequestException(`Liquidité insuffisante pour ${countryCode} (${currency})`);
    return db.liquidityPool.findUniqueOrThrow({ where: { countryCode_currency: { countryCode, currency } } });
  }

  async finalizeLiquidityDebit(countryCode: string, currency: string, amount: number, prismaTx?: Prisma.TransactionClient) {
    const db = prismaTx || this.prisma;

    const result = await db.liquidityPool.updateMany({
      where: { countryCode, currency, reservedBalance: { gte: amount } },
      data: { reservedBalance: { decrement: amount } },
    });
    if (result.count !== 1) throw new BadRequestException(`Réservation de liquidité introuvable pour ${countryCode} (${currency})`);
  }

  async creditOriginLiquidity(countryCode: string, currency: string, amount: number, prismaTx?: Prisma.TransactionClient) {
    const db = prismaTx || this.prisma;

    const result = await db.liquidityPool.updateMany({
      where: { countryCode, currency },
      data: { availableBalance: { increment: amount } },
    });
    if (result.count !== 1) throw new BadRequestException(`Pool de liquidité introuvable pour ${countryCode} (${currency})`);
  }

  async releaseLiquidityReservation(countryCode: string, currency: string, amount: number, prismaTx?: Prisma.TransactionClient) {
    const db = prismaTx || this.prisma;
    const result = await db.liquidityPool.updateMany({
      where: { countryCode, currency, reservedBalance: { gte: amount } },
      data: { reservedBalance: { decrement: amount }, availableBalance: { increment: amount } },
    });
    if (result.count !== 1) throw new BadRequestException(`Réservation de liquidité introuvable pour ${countryCode} (${currency})`);
  }
}
