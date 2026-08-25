import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LiquidityService } from './liquidity.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@optimal/shared';

@ApiTags('Gestion de Trésorerie & Liquidités')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('liquidity')
export class LiquidityController {
  constructor(private readonly liquidityService: LiquidityService) {}

  @Get('pools')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Consulter les soldes des pools de liquidité en temps réel' })
  async getPools() {
    return this.liquidityService.getAllPools();
  }
}
