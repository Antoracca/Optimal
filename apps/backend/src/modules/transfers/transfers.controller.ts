import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { InitiateTransferDtoSchema, InitiateTransferDto } from '@optimal/shared';

@ApiTags('Transferts d\'argent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initier un transfert d\'argent (Mobile Money vers Virement Maroc / Point Relais)' })
  async initiate(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(InitiateTransferDtoSchema)) dto: InitiateTransferDto,
  ) {
    return this.transfersService.initiateTransfer(userId, dto);
  }

  @Get('my-transfers')
  @ApiOperation({ summary: 'Historique des transferts du client connecté' })
  async getMyTransfers(@CurrentUser('id') userId: string) {
    return this.transfersService.findUserTransfers(userId);
  }

  @Get(':reference')
  @ApiOperation({ summary: 'Suivre l\'état d\'un transfert en direct par référence' })
  async getByReference(@CurrentUser() user: { id: string; role: string }, @Param('reference') reference: string) {
    return this.transfersService.findByReference(user.id, user.role as any, reference);
  }
}
