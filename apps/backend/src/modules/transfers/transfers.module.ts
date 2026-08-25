import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { RatesModule } from '../rates/rates.module';
import { LiquidityModule } from '../liquidity/liquidity.module';
import { LedgerModule } from '../ledger/ledger.module';
import { CashPickupModule } from '../cash-pickup/cash-pickup.module';
import { ProvidersModule } from '../providers/providers.module';
import { PayoutsModule } from '../payouts/payouts.module';

@Module({
  imports: [
    RatesModule,
    LiquidityModule,
    LedgerModule,
    CashPickupModule,
    ProvidersModule,
    PayoutsModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TransfersService],
})
export class TransfersModule {}
