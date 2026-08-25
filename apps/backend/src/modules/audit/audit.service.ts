import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: input,
    });
  }
}
