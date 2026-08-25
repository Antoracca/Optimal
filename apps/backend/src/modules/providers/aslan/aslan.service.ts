import { Injectable, Logger } from '@nestjs/common';
import { IPayoutProvider, InitiatePayoutParams, PayoutResult } from '../interfaces/payout-provider.interface';

@Injectable()
export class AslanService implements IPayoutProvider {
  private readonly logger = new Logger(AslanService.name);

  async initiateBankTransfer(params: InitiatePayoutParams): Promise<PayoutResult> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Aslan adapter is not configured. Implement the contractual API adapter before production use.');
    }
    this.logger.log(
      `[Aslan Provider] Déclenchement virement de secours vers RIB ${params.beneficiaryRib} (${params.amountMad} MAD)`,
    );

    const mockTransferId = `ASLAN-TR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      providerTransferId: mockTransferId,
      status: 'INITIATED',
      rawResponse: {
        payout_id: mockTransferId,
        destination_iban: params.beneficiaryRib,
        amount: params.amountMad,
        currency: 'MAD',
        status: 'PROCESSING',
      },
    };
  }

  async verifyPayout(providerTransferId: string): Promise<boolean> {
    this.logger.log(`[Aslan] Vérification pour ${providerTransferId}`);
    return true;
  }
}
