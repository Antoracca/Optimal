import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { TransfersService } from '../transfers/transfers.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private transfersService: TransfersService) {}

  /**
   * Traitement webhook Airtel Money
   */
  async handleAirtelWebhook(payload: any, signature?: string) {
    this.logger.log(`[Webhook Airtel] Reçu: ${JSON.stringify(payload)}`);
    // Dans le payload Airtel, la référence de transfert se trouve dans transaction.reference
    const reference = payload?.transaction?.reference || payload?.reference;
    const status = payload?.transaction?.status_code || payload?.status;

    if (!reference) {
      throw new BadRequestException('Référence de transfert manquante dans le webhook');
    }

    if (status === 'TS' || status === 'SUCCESS' || status === '200') {
      return this.transfersService.handlePaymentConfirmed(reference, payload);
    } else {
      this.logger.warn(`Paiement Airtel échoué pour ${reference}`);
      return { status: 'FAILED' };
    }
  }

  /**
   * Traitement webhook Orange Money
   */
  async handleOrangeWebhook(payload: any) {
    this.logger.log(`[Webhook Orange] Reçu: ${JSON.stringify(payload)}`);
    const reference = payload?.order_id || payload?.reference;
    const status = payload?.status;

    if (!reference) {
      throw new BadRequestException('Référence de commande manquante');
    }

    if (status === 'SUCCESS' || status === 'SUCCESSFULL') {
      return this.transfersService.handlePaymentConfirmed(reference, payload);
    }
    return { status: 'IGNORED' };
  }

  /**
   * Traitement webhook MTN MoMo
   */
  async handleMtnWebhook(payload: any) {
    this.logger.log(`[Webhook MTN] Reçu: ${JSON.stringify(payload)}`);
    const reference = payload?.externalId || payload?.reference;
    const status = payload?.status;

    if (status === 'SUCCESSFUL') {
      return this.transfersService.handlePaymentConfirmed(reference, payload);
    }
    return { status: 'IGNORED' };
  }

  /**
   * Traitement webhook ChariBaaS (Virement bancaire Maroc)
   */
  async handleChariBaasWebhook(payload: any) {
    this.logger.log(`[Webhook ChariBaaS] Reçu: ${JSON.stringify(payload)}`);
    const event = payload?.event || payload?.type;
    const transferId = payload?.data?.id || payload?.transferId;

    if (!transferId) {
      throw new BadRequestException('ID de virement ChariBaaS manquant');
    }

    if (event === 'bank-transfer.completed' || payload?.data?.status === 'COMPLETED') {
      return this.transfersService.handlePayoutCompleted(transferId, payload);
    }

    return { status: 'PENDING_UPDATE' };
  }

  /**
   * Endpoint de simulation (pour les tests et la démo en environnement local)
   */
  async simulatePaymentConfirmation(reference: string) {
    this.logger.log(`[Simulation Webhook] Validation forcée pour le transfert ${reference}`);
    return this.transfersService.handlePaymentConfirmed(reference, {
      simulated: true,
      timestamp: new Date().toISOString(),
    });
  }
}
