import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Statistiques journalières et globales pour le dashboard Admin
   */
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTransfersCount = await this.prisma.transfer.count();
    const todayTransfersCount = await this.prisma.transfer.count({
      where: { createdAt: { gte: today } },
    });

    const completedTransfers = await this.prisma.transfer.findMany({
      where: { status: 'COMPLETED' },
      select: { receiveAmount: true, feeAmount: true, sendCountry: true },
    });

    const totalVolumeMad = completedTransfers.reduce((sum, t) => sum + Number(t.receiveAmount), 0);
    const totalFeesRevenueMad = completedTransfers.reduce((sum, t) => sum + Number(t.feeAmount), 0);

    // Répartition par pays
    const volumeByCountry: Record<string, { count: number; volumeMad: number }> = {};
    for (const t of completedTransfers) {
      if (!volumeByCountry[t.sendCountry]) {
        volumeByCountry[t.sendCountry] = { count: 0, volumeMad: 0 };
      }
      volumeByCountry[t.sendCountry].count += 1;
      volumeByCountry[t.sendCountry].volumeMad += Number(t.receiveAmount);
    }

    return {
      totalTransfersCount,
      todayTransfersCount,
      totalVolumeMad,
      totalFeesRevenueMad,
      volumeByCountry,
    };
  }

  /**
   * Génération automatique du fichier Excel journalier
   */
  async generateDailyExcelReport(targetDate?: Date): Promise<ExcelJS.Buffer> {
    const date = targetDate || new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const transfers = await this.prisma.transfer.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        sender: true,
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Optimal Remittance Engine';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Transactions du jour');

    worksheet.columns = [
      { header: 'Date & Heure', key: 'date', width: 20 },
      { header: 'Référence', key: 'reference', width: 18 },
      { header: 'Expéditeur', key: 'sender', width: 22 },
      { header: 'Téléphone Exp.', key: 'senderPhone', width: 16 },
      { header: 'Pays Origine', key: 'country', width: 12 },
      { header: 'Montant Envoyé', key: 'sendAmount', width: 16 },
      { header: 'Devise Origine', key: 'sendCurrency', width: 14 },
      { header: 'Frais Perçus', key: 'feeAmount', width: 14 },
      { header: 'Montant MAD Reçu', key: 'receiveAmount', width: 18 },
      { header: 'Taux Appliqué', key: 'rate', width: 14 },
      { header: 'Bénéficiaire', key: 'recipient', width: 22 },
      { header: 'Mode Livraison', key: 'deliveryMethod', width: 16 },
      { header: 'Statut', key: 'status', width: 18 },
    ];

    // En-tête stylisé
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Slate 800
    };

    for (const t of transfers) {
      worksheet.addRow({
        date: t.createdAt.toISOString().replace('T', ' ').substring(0, 19),
        reference: t.reference,
        sender: t.sender.fullName,
        senderPhone: t.sender.phoneNumber,
        country: t.sendCountry,
        sendAmount: Number(t.sendAmount),
        sendCurrency: t.sendCurrency,
        feeAmount: Number(t.feeAmount),
        receiveAmount: Number(t.receiveAmount),
        rate: Number(t.appliedExchangeRate),
        recipient: t.recipient.fullName,
        deliveryMethod: t.deliveryMethod,
        status: t.status,
      });
    }

    return workbook.xlsx.writeBuffer();
  }

  /**
   * Génération de reçu de transfert au format PDF
   */
  async generateTransferReceiptPdf(reference: string): Promise<Buffer> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { reference },
      include: { sender: true, recipient: true },
    });

    if (!transfer) {
      throw new Error('Transfert introuvable');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // En-tête
      doc.fontSize(22).fillColor('#0F172A').text('OPTIMAL REMITTANCE', { align: 'center' });
      doc.fontSize(10).fillColor('#64748B').text('Reçu officiel de transfert d\'argent international', { align: 'center' });
      doc.moveDown(2);

      // Détails
      doc.fontSize(14).fillColor('#1E293B').text(`Référence : ${transfer.reference}`);
      doc.fontSize(10).fillColor('#64748B').text(`Date : ${transfer.createdAt.toUTCString()}`);
      doc.text(`Statut : ${transfer.status}`);
      doc.moveDown(1);

      doc.rect(50, 160, 500, 1).fill('#E2E8F0');
      doc.moveDown(2);

      // Expéditeur & Bénéficiaire
      doc.fontSize(12).fillColor('#0F172A').text('EXPÉDITEUR', 50, 180);
      doc.fontSize(10).fillColor('#334155').text(`Nom : ${transfer.sender.fullName}`, 50, 200);
      doc.text(`Téléphone : ${transfer.sender.phoneNumber}`, 50, 215);
      doc.text(`Pays : ${transfer.sendCountry}`, 50, 230);

      doc.fontSize(12).fillColor('#0F172A').text('BÉNÉFICIAIRE (MAROC)', 300, 180);
      doc.fontSize(10).fillColor('#334155').text(`Nom : ${transfer.recipient.fullName}`, 300, 200);
      doc.text(`Téléphone : ${transfer.recipient.phoneNumber}`, 300, 215);
      doc.text(`Mode : ${transfer.deliveryMethod}`, 300, 230);
      if (transfer.recipient.bankRib) {
        doc.text(`RIB : ${transfer.recipient.bankRib}`, 300, 245);
      }

      doc.moveDown(4);
      doc.rect(50, 280, 500, 1).fill('#E2E8F0');

      // Récapitulatif financier
      doc.fontSize(12).fillColor('#0F172A').text('DÉTAILS FINANCIERS', 50, 300);
      doc.fontSize(11).fillColor('#334155').text(`Montant envoyé : ${transfer.sendAmount} ${transfer.sendCurrency}`, 50, 325);
      doc.text(`Frais de service : ${transfer.feeAmount} ${transfer.sendCurrency}`, 50, 345);
      doc.text(`Total payé : ${transfer.totalCharged} ${transfer.sendCurrency}`, 50, 365);
      doc.text(`Taux de change appliqué : 1 ${transfer.sendCurrency} = ${transfer.appliedExchangeRate} MAD`, 50, 385);
      
      doc.fontSize(14).fillColor('#059669').text(`MONTANT REÇU : ${transfer.receiveAmount} MAD`, 50, 415);

      doc.moveDown(4);
      doc.fontSize(9).fillColor('#94A3B8').text('Merci pour votre confiance. Service sécurisé par Optimal Remittance.', 50, 500, { align: 'center' });

      doc.end();
    });
  }
}
