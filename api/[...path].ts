import './setup-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SanitizationInterceptor } from '../backend/src/common/interceptors/sanitization.interceptor';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
let isInitialized = false;
let initError: any = null;

async function bootstrapServer() {
  if (!isInitialized) {
    try {
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
    } catch (err: any) {
      initError = err;
      console.error('NestJS Bootstrap Initialization Error:', err);
      throw err;
    }
  }
}

export default async (req: any, res: any) => {
  try {
    if (initError) {
      return res.status(500).json({
        statusCode: 500,
        error: 'Bootstrap Error',
        message: initError.message || String(initError),
      });
    }

    await bootstrapServer();

    let rawPath =
      req.headers['x-matched-path'] ||
      req.headers['x-original-url'] ||
      req.headers['x-forwarded-url'] ||
      req.url ||
      '/';

    if (rawPath.includes('[...path]')) {
      rawPath = req.headers['x-original-url'] || req.url || '/';
    }

    req.url = rawPath;
    req.originalUrl = rawPath;
    delete (req as any)._parsedUrl;
    delete (req as any)._parsedUrlUrl;

    server(req, res);
  } catch (err: any) {
    console.error('Vercel Serverless Execution Error:', err);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message || String(err),
      stack: err.stack,
    });
  }
};
