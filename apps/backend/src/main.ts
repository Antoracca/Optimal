import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('OptimalBootstrap');
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // Sécurité & CORS
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map((origin) => origin.trim());
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Préfixe global d'API
  app.setGlobalPrefix('api/v1');

  // Documentation OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('Optimal Remittance API')
    .setDescription(
      'Plateforme Fintech internationale de transfert d\'argent (Afrique Centrale vers Maroc)',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentification')
    .addTag('Taux de change & Devis')
    .addTag('Bénéficiaires (Maroc)')
    .addTag('Transferts d\'argent')
    .addTag('Webhooks Réseau & Passerelles')
    .addTag('Guichet & Retrait d\'espèces (Point Relais Maroc)')
    .addTag('Gestion de Trésorerie & Liquidités')
    .addTag('Rapports, Statistiques & Reçus')
    .build();

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Documentation API Optimal Remittance',
    });
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Optimal Backend API démarré sur : http://localhost:${port}/api/v1`);
  logger.log(`📚 Documentation Swagger disponible sur : http://localhost:${port}/api/docs`);
}

bootstrap();
