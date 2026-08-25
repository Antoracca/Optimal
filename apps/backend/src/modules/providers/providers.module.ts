import { Module } from '@nestjs/common';
import { AirtelMoneyService } from './airtel/airtel-money.service';
import { OrangeMoneyService } from './orange/orange-money.service';
import { MtnMomoService } from './mtn/mtn-momo.service';
import { ChariBaasService } from './charibaas/charibaas.service';
import { AslanService } from './aslan/aslan.service';

@Module({
  providers: [
    AirtelMoneyService,
    OrangeMoneyService,
    MtnMomoService,
    ChariBaasService,
    AslanService,
  ],
  exports: [
    AirtelMoneyService,
    OrangeMoneyService,
    MtnMomoService,
    ChariBaasService,
    AslanService,
  ],
})
export class ProvidersModule {}
