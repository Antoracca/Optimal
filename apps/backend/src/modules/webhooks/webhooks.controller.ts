import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks Réseau & Passerelles')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('airtel-money')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notification Airtel Money (Gabon, RDC)' })
  async airtelWebhook(@Body() payload: any, @Headers('x-signature') signature?: string) {
    return this.webhooksService.handleAirtelWebhook(payload, signature);
  }

  @Post('orange-money')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notification Orange Money (Cameroun, RCA)' })
  async orangeWebhook(@Body() payload: any) {
    return this.webhooksService.handleOrangeWebhook(payload);
  }

  @Post('mtn-momo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notification MTN MoMo (Cameroun)' })
  async mtnWebhook(@Body() payload: any) {
    return this.webhooksService.handleMtnWebhook(payload);
  }

  @Post('charibaas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notification ChariBaaS (Virement bancaire Maroc)' })
  async chariBaasWebhook(@Body() payload: any) {
    return this.webhooksService.handleChariBaasWebhook(payload);
  }

  @Post('simulate-payment/:reference')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simuler la confirmation d\'un paiement (Test & Démo)' })
  async simulatePayment(@Param('reference') reference: string) {
    return this.webhooksService.simulatePaymentConfirmation(reference);
  }
}
