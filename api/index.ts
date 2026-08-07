import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SanitizationInterceptor } from '../backend/src/common/interceptors/sanitization.interceptor';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

// Setup writable SQLite database for Vercel Serverless environment
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  const tmpDbPath = '/tmp/dev.db';
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('./dev.db')) {
    const seedDbPath = path.join(process.cwd(), 'backend', 'prisma', 'dev.db');
    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(seedDbPath)) {
        fs.copyFileSync(seedDbPath, tmpDbPath);
      }
    } catch (e) {
      console.warn('Could not copy SQLite seed DB to /tmp:', e);
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
}

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