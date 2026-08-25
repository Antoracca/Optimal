import { Injectable, Logger } from '@nestjs/common';
import { IPayoutProvider, InitiatePayoutParams, PayoutResult } from '../interfaces/payout-provider.interface';

@Injectable()
export class ChariBaasService implements IPayoutProvider {
  private readonly logger = new Logger(ChariBaasService.name);

  async initiateBankTransfer(params: InitiatePayoutParams): Promise<PayoutResult> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ChariBaaS adapter is not configured. Implement the contractual API adapter before production use.');
    }
    this.logger.log(
      `[ChariBaaS] Déclenchement du virement bancaire vers RIB ${params.beneficiaryRib} (${params.amountMad} MAD)`,
    );

    // En environnement de dev / simulation
    const mockTransferId = `CHARI-TR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      providerTransferId: mockTransferId,
      status: 'INITIATED',
      rawResponse: {
        id: mockTransferId,
        recipient_name: params.beneficiaryName,
        rib: params.beneficiaryRib,
        amount: params.amountMad,
        currency: 'MAD',
        status: 'PENDING_CLEARING',
        fee: 5.0,
        idempotency_key: params.idempotencyKey,
      },
    };
  }

  async verifyPayout(providerTransferId: string): Promise<boolean> {
    this.logger.log(`[ChariBaaS] Vérification du statut du virement pour ${providerTransferId}`);
    return true;
  }
}
