import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipientDto } from '@optimal/shared';
import { EncryptionService } from '../security/encryption.service';

@Injectable()
export class RecipientsService {
  constructor(private prisma: PrismaService, private readonly encryption: EncryptionService) {}

  async create(userId: string, dto: CreateRecipientDto) {
    const recipient = await this.prisma.recipient.create({
      data: {
        userId,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        deliveryMethod: dto.deliveryMethod,
        bankName: dto.bankName || null,
        bankRib: dto.bankRib ? this.encryption.encrypt(dto.bankRib) : null,
        city: dto.city || null,
      },
    });
    return this.serialize(recipient);
  }

  async findAllByUser(userId: string) {
    const recipients = await this.prisma.recipient.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return recipients.map((recipient) => this.serialize(recipient));
  }

  async findOne(userId: string, id: string) {
    const recipient = await this.prisma.recipient.findFirst({
      where: { id, userId },
    });

    if (!recipient) {
      throw new NotFoundException('Bénéficiaire introuvable');
    }

    return this.serialize(recipient);
  }

  async delete(userId: string, id: string) {
    const recipient = await this.findOne(userId, id);
    return this.prisma.recipient.delete({
      where: { id: recipient.id },
    });
  }

  decryptRib(value: string) {
    return this.encryption.decrypt(value);
  }

  private serialize<T extends { bankRib: string | null }>(recipient: T) {
    return { ...recipient, bankRib: recipient.bankRib ? this.encryption.mask(this.encryption.decrypt(recipient.bankRib)) : null };
  }
}
