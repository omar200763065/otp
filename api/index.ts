import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../backend/src/app.module';
import { SanitizationInterceptor } from '../backend/src/common/interceptors/sanitization.interceptor';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let isInitialized = false;

async function bootstrapServerless() {
  if (!isInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
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
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    isInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  // Fix Vercel URL rewrite path forwarding
  if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  }
  console.log(`[Vercel Serverless Request] ${req.method} ${req.url}`);
  await bootstrapServerless();
  server(req, res);
}
