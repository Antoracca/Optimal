import { Injectable, Logger } from '@nestjs/common';
import { ICollectionProvider, InitiateCollectionParams, CollectionResult } from '../interfaces/collection-provider.interface';

@Injectable()
export class MtnMomoService implements ICollectionProvider {
  private readonly logger = new Logger(MtnMomoService.name);

  async initiatePayment(params: InitiateCollectionParams): Promise<CollectionResult> {
    this.logger.log(`[MTN MoMo] Demande de débit pour ${params.payerPhoneNumber} (${params.amount} ${params.currency})`);

    const mockTxId = `MOMO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      providerTransactionId: mockTxId,
      status: 'PENDING',
      instructions: 'Veuillez accepter la demande de débit reçue par SMS/Notification MTN MoMo.',
      rawResponse: {
        financialTransactionId: mockTxId,
        status: 'PENDING',
      },
    };
  }

  async verifyPayment(providerTransactionId: string): Promise<boolean> {
    this.logger.log(`[MTN MoMo] Vérification du statut pour ${providerTransactionId}`);
    return true;
  }
}
