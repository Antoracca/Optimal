import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecipientsService } from './recipients.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateRecipientDtoSchema, CreateRecipientDto } from '@optimal/shared';

@ApiTags('Bénéficiaires (Maroc)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recipients')
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un nouveau bénéficiaire au Maroc' })
  async create(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(CreateRecipientDtoSchema)) dto: CreateRecipientDto,
  ) {
    return this.recipientsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les bénéficiaires de l\'utilisateur' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.recipientsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un bénéficiaire' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.recipientsService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un bénéficiaire' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.recipientsService.delete(userId, id);
  }
}
