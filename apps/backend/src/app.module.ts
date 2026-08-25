import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RatesModule } from './modules/rates/rates.module';
import { RecipientsModule } from './modules/recipients/recipients.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { LiquidityModule } from './modules/liquidity/liquidity.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { CashPickupModule } from './modules/cash-pickup/cash-pickup.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { SecurityModule } from './modules/security/security.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
        if (!config.DATA_ENCRYPTION_KEY) throw new Error('DATA_ENCRYPTION_KEY is required');
        return config;
      },
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    SecurityModule,
    AuditModule,
    PrismaModule,
    AuthModule,
    RatesModule,
    RecipientsModule,
    TransfersModule,
    LiquidityModule,
    LedgerModule,
    CashPickupModule,
    ProvidersModule,
    WebhooksModule,
    ReportsModule,
    PayoutsModule,
  ],
})
export class AppModule {}
