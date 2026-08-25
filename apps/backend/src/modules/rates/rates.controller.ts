import { Controller, Post, Body, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RatesService } from './rates.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { GetQuoteDtoSchema, GetQuoteDto, UpdateExchangeRateDtoSchema, UpdateExchangeRateDto, Role } from '@optimal/shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Taux de change & Devis')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post('quote')
  @ApiOperation({ summary: 'Obtenir un devis de transfert en temps réel avec verrouillage 15 min' })
  @ApiResponse({ status: 200, description: 'Calcul du devis réussi' })
  async getQuote(@Body(new ZodValidationPipe(GetQuoteDtoSchema)) dto: GetQuoteDto) {
    return this.ratesService.getQuote(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des taux de change actifs' })
  async getAllRates() {
    return this.ratesService.getAllRates();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un taux de change ou la marge (Admin uniquement)' })
  async updateRate(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(UpdateExchangeRateDtoSchema)) dto: UpdateExchangeRateDto,
  ) {
    return this.ratesService.updateRate(userId, dto);
  }
}
