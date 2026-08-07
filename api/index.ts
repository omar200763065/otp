import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SanitizationInterceptor } from '../backend/src/common/interceptors/sanitization.interceptor';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
let isInitialized = false;

async function bootstrapServer() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    });

    app.useGlobalInterceptors(new SanitizationInterceptor());

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

    await app.init();
    isInitialized = true;
  }
}

export default async (req: any, res: any) => {
  await bootstrapServer();
  server(req, res);
};