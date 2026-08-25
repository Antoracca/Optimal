import { Controller, Get, Param, Res, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@optimal/shared';

@ApiTags('Rapports, Statistiques & Reçus')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques consolidées pour le tableau de bord Admin' })
  async getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('daily-excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Télécharger le rapport Excel journalier des transactions' })
  async downloadDailyExcel(@Res() res: Response, @Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const buffer = await this.reportsService.generateDailyExcelReport(date);

    const formattedDate = date.toISOString().split('T')[0];
    const filename = `Rapport_Optimal_${formattedDate}.xlsx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    res.send(buffer);
  }

  @Get('receipt-pdf/:reference')
  @ApiOperation({ summary: 'Télécharger le reçu officiel de transfert au format PDF' })
  async downloadReceiptPdf(@Param('reference') reference: string, @Res() res: Response) {
    const buffer = await this.reportsService.generateTransferReceiptPdf(reference);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Recu_${reference}.pdf"`,
    });

    res.send(buffer);
  }
}
