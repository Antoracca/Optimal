import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { RegisterDtoSchema, RegisterDto, LoginDtoSchema, LoginDto, AdminLoginDtoSchema, AdminLoginDto, RefreshTokenDtoSchema, RefreshTokenDto } from '@optimal/shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouveau client' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  async register(@Body(new ZodValidationPipe(RegisterDtoSchema)) dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, this.requestContext(req));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion mobile du client par téléphone' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  async login(@Body(new ZodValidationPipe(LoginDtoSchema)) dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, this.requestContext(req));
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion portail Web Admin & Gérants de relais' })
  @ApiResponse({ status: 200, description: 'Connexion admin réussie' })
  async adminLogin(@Body(new ZodValidationPipe(AdminLoginDtoSchema)) dto: AdminLoginDto, @Req() req: Request) {
    return this.authService.adminLogin(dto, this.requestContext(req));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body(new ZodValidationPipe(RefreshTokenDtoSchema)) dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.rotateRefreshToken(dto.refreshToken, this.requestContext(req));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body(new ZodValidationPipe(RefreshTokenDtoSchema)) dto: RefreshTokenDto) {
    await this.authService.revokeRefreshToken(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      fullName: user.fullName,
      countryCode: user.countryCode,
      role: user.role,
      kycTier: user.kycTier,
    };
  }

  private requestContext(req: Request) {
    return { ipAddress: req.ip, userAgent: req.get('user-agent') };
  }
}
