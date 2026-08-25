import { Injectable, Logger } from '@nestjs/common';
import { ICollectionProvider, InitiateCollectionParams, CollectionResult } from '../interfaces/collection-provider.interface';

@Injectable()
export class OrangeMoneyService implements ICollectionProvider {
  private readonly logger = new Logger(OrangeMoneyService.name);

  async initiatePayment(params: InitiateCollectionParams): Promise<CollectionResult> {
    this.logger.log(`[Orange Money] Initiation du paiement pour ${params.payerPhoneNumber} (${params.amount} ${params.currency})`);

    const mockTxId = `OM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      providerTransactionId: mockTxId,
      status: 'PENDING',
      instructions: 'Composez le #150*50# ou validez la notification Orange Money sur votre mobile.',
      rawResponse: {
        payment_token: mockTxId,
        status: 'PENDING',
      },
    };
  }

  async verifyPayment(providerTransactionId: string): Promise<boolean> {
    this.logger.log(`[Orange Money] Vérification du statut pour ${providerTransactionId}`);
    return true;
  }
}
