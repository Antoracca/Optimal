import { Module } from '@nestjs/common';
import { CashPickupService } from './cash-pickup.service';
import { CashPickupController } from './cash-pickup.controller';

@Module({
  controllers: [CashPickupController],
  providers: [CashPickupService],
  exports: [CashPickupService],
})
export class CashPickupModule {}
