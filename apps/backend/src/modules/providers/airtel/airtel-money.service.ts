import { Injectable, Logger } from '@nestjs/common';
import { ICollectionProvider, InitiateCollectionParams, CollectionResult } from '../interfaces/collection-provider.interface';

@Injectable()
export class AirtelMoneyService implements ICollectionProvider {
  private readonly logger = new Logger(AirtelMoneyService.name);

  async initiatePayment(params: InitiateCollectionParams): Promise<CollectionResult> {
    this.logger.log(`[Airtel Money] Initiation du paiement pour ${params.payerPhoneNumber} (${params.amount} ${params.currency})`);

    // En environnement de dev / simulation
    const mockTxId = `AIRTEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      providerTransactionId: mockTxId,
      status: 'PENDING',
      instructions: 'Veuillez valider la notification USSD sur votre téléphone Airtel et entrer votre code PIN.',
      rawResponse: {
        status: {
          code: '200',
          message: 'USSD Push envoyé au client',
          result_code: 'IN_PROCESS',
        },
      },
    };
  }

  async verifyPayment(providerTransactionId: string): Promise<boolean> {
    this.logger.log(`[Airtel Money] Vérification du statut pour ${providerTransactionId}`);
    return true;
  }
}
