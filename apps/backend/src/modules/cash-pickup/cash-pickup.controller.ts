import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CashPickupService } from './cash-pickup.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ValidateCashPickupDtoSchema, ValidateCashPickupDto, Role } from '@optimal/shared';

@ApiTags('Guichet & Retrait d\'espèces (Point Relais Maroc)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cash-pickup')
export class CashPickupController {
  constructor(private readonly cashPickupService: CashPickupService) {}

  @Get('lookup/:reference')
  @Roles(Role.AGENT_RELAIS, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rechercher un ordre de retrait par sa référence' })
  async lookup(@Param('reference') reference: string) {
    return this.cashPickupService.getVoucherByRef(reference);
  }

  @Post('validate')
  @Roles(Role.AGENT_RELAIS, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Valider le retrait d\'espèces et la remise des fonds au bénéficiaire' })
  async validate(
    @CurrentUser('id') agentId: string,
    @Body(new ZodValidationPipe(ValidateCashPickupDtoSchema)) dto: ValidateCashPickupDto,
  ) {
    return this.cashPickupService.validatePickup(agentId, dto);
  }
}
