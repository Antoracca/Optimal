import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AdminLoginDto, Role } from '@optimal/shared';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

type RequestContext = { ipAddress?: string; userAgent?: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto, context: RequestContext = {}) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phoneNumber: dto.phoneNumber }, ...(dto.email ? [{ email: dto.email }] : [])] },
    });
    if (existing) throw new ConflictException('Un compte existe déjà avec ce numéro de téléphone ou cet email');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { phoneNumber: dto.phoneNumber, email: dto.email || null, fullName: dto.fullName, countryCode: dto.countryCode, passwordHash, role: Role.CLIENT },
    });
    await this.audit.record({ userId: user.id, action: 'REGISTER', entity: 'User', entityId: user.id, ...context });
    return { user: this.serializeUser(user), ...(await this.generateTokens(user.id, user.role, context)) };
  }

  async login(dto: LoginDto, context: RequestContext = {}) {
    const user = await this.prisma.user.findUnique({ where: { phoneNumber: dto.phoneNumber } });
    if (!user || user.isBlocked || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    await this.audit.record({ userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, ...context });
    return { user: this.serializeUser(user), ...(await this.generateTokens(user.id, user.role, context)) };
  }

  async adminLogin(dto: AdminLoginDto, context: RequestContext = {}) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const isAdmin = user && [Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT_RELAIS].includes(user.role);
    if (!isAdmin || user.isBlocked || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Accès refusé ou identifiants invalides');
    }
    await this.audit.record({ userId: user.id, action: 'ADMIN_LOGIN', entity: 'User', entityId: user.id, ...context });
    return { user: this.serializeUser(user), ...(await this.generateTokens(user.id, user.role, context)) };
  }

  async rotateRefreshToken(rawToken: string, context: RequestContext = {}) {
    const token = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hashToken(rawToken) }, include: { user: true } });
    if (!token || token.revokedAt || token.expiresAt <= new Date() || token.user.isBlocked) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
    await this.prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } });
    return this.generateTokens(token.user.id, token.user.role, context);
  }

  async revokeRefreshToken(rawToken: string) {
    await this.prisma.refreshToken.updateMany({ where: { tokenHash: this.hashToken(rawToken), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async generateTokens(userId: string, role: Role, context: RequestContext) {
    const accessToken = await this.jwtService.signAsync({ sub: userId, role });
    const refreshToken = crypto.randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({ data: { userId, tokenHash: this.hashToken(refreshToken), expiresAt, ...context } });
    return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '15m' };
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private serializeUser(user: { id: string; fullName: string; phoneNumber: string; email: string | null; countryCode: string; role: Role; kycTier: unknown }) {
    return { id: user.id, fullName: user.fullName, phoneNumber: user.phoneNumber, email: user.email, countryCode: user.countryCode, role: user.role, kycTier: user.kycTier };
  }
}
