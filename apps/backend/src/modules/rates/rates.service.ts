import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetQuoteDto, QuoteResponse, UpdateExchangeRateDto, SUPPORTED_ORIGIN_COUNTRIES } from '@optimal/shared';

@Injectable()
export class RatesService {
  constructor(private prisma: PrismaService) {}

  async getQuote(dto: GetQuoteDto): Promise<QuoteResponse> {
    const country = SUPPORTED_ORIGIN_COUNTRIES[dto.originCountry];
    if (!country) {
      throw new BadRequestException(`Pays d'origine non supporté: ${dto.originCountry}`);
    }

    const sendCurrency = country.currency;
    const receiveCurrency = 'MAD';

    const exchangeRate = await this.prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: sendCurrency,
          toCurrency: receiveCurrency,
        },
      },
    });

    if (!exchangeRate || !exchangeRate.isActive) {
      throw new NotFoundException(`Taux de change indisponible pour le corridor ${sendCurrency} -> ${receiveCurrency}`);
    }

    const rate = Number(exchangeRate.appliedRate);

    // Calcul des frais
    const feeConfig = await this.prisma.feeConfiguration.findFirst({
      where: {
        countryCode: dto.originCountry,
        deliveryMethod: dto.deliveryMethod,
      },
    });

    const fixedFee = feeConfig ? Number(feeConfig.fixedFee) : 1500;
    const percentFee = feeConfig ? Number(feeConfig.percentFee) : 1.0;

    let sendAmount: number;
    let receiveAmount: number;
    let feeAmount: number;
    let totalToPay: number;

    if (dto.isSendingAmount) {
      sendAmount = dto.amount;
      feeAmount = Math.round(fixedFee + (sendAmount * (percentFee / 100)));
      totalToPay = sendAmount + feeAmount;
      receiveAmount = Number((sendAmount * rate).toFixed(2));
    } else {
      // Saisie en MAD
      receiveAmount = dto.amount;
      sendAmount = Math.round(receiveAmount / rate);
      feeAmount = Math.round(fixedFee + (sendAmount * (percentFee / 100)));
      totalToPay = sendAmount + feeAmount;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes lock

    return {
      originCountry: dto.originCountry,
      sendCurrency,
      sendAmount,
      feeAmount,
      totalToPay,
      receiveCurrency: 'MAD',
      receiveAmount,
      exchangeRate: rate,
      deliveryMethod: dto.deliveryMethod,
      rateExpiresInSeconds: 900,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async getAllRates() {
    return this.prisma.exchangeRate.findMany({
      orderBy: { fromCurrency: 'asc' },
    });
  }

  async updateRate(userId: string, dto: UpdateExchangeRateDto) {
    const spread = dto.spreadPercent / 100;
    const appliedRate = dto.marketRate * (1 - spread);

    return this.prisma.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: dto.fromCurrency,
          toCurrency: dto.toCurrency,
        },
      },
      update: {
        marketRate: dto.marketRate,
        appliedRate,
        spreadPercent: dto.spreadPercent,
        updatedBy: userId,
      },
      create: {
        fromCurrency: dto.fromCurrency,
        toCurrency: dto.toCurrency,
        marketRate: dto.marketRate,
        appliedRate,
        spreadPercent: dto.spreadPercent,
        updatedBy: userId,
      },
    });
  }
}
