import { Module } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { ProvidersModule } from '../providers/providers.module';
import { LiquidityModule } from '../liquidity/liquidity.module';

@Module({
  imports: [ProvidersModule, LiquidityModule],
  providers: [PayoutsService],
  exports: [PayoutsService],
})
export class PayoutsModule {}
