import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { SanitizationInterceptor } from './common/interceptors/sanitization.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Enterprise Security Headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Allowed for Swagger UI
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  }));

  // 2. Strict CORS Security Policy
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  // 3. Global XSS Input Sanitization Interceptor
  app.useGlobalInterceptors(new SanitizationInterceptor());

  // 4. Global Validation Pipe with strict DTO whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. OpenAPI Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Enterprise OTP SaaS Platform API')
    .setDescription('Production-ready multi-channel OTP service supporting WhatsApp Cloud API & Baileys QR Code session.')
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'OTP SaaS API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;

  // 6. Serve React Frontend UI if dist directory exists
  const candidatePaths = [
    path.join(__dirname, '..', '..', '..', 'frontend', 'dist'),
    path.join(__dirname, '..', '..', 'frontend', 'dist'),
    path.join(process.cwd(), '..', 'frontend', 'dist'),
    path.join(process.cwd(), 'frontend', 'dist'),
  ];
  let distPath = candidatePaths.find(p => fs.existsSync(p));

  if (distPath) {
    app.use(express.static(distPath));
    app.use((req: any, res: any, next: any) => {
      if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/admin') && !req.path.startsWith('/otp')) {
        return res.sendFile(path.join(distPath!, 'index.html'));
      }
      next();
    });
  }

  await app.listen(port);

  logger.log(`🚀 OTP SaaS Backend Server running on port ${port}`);
  logger.log(`🖥️ React Frontend Application available at http://localhost:${port}/`);
  logger.log(`📚 OpenAPI Swagger Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
