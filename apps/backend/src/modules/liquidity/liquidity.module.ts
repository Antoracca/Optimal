import { Module } from '@nestjs/common';
import { LiquidityService } from './liquidity.service';
import { LiquidityController } from './liquidity.controller';

@Module({
  controllers: [LiquidityController],
  providers: [LiquidityService],
  exports: [LiquidityService],
})
export class LiquidityModule {}
