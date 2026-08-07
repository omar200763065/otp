import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const defaultUrl = process.env.VERCEL
      ? 'file:/tmp/dev.db'
      : `file:${path.join(process.cwd(), 'backend', 'prisma', 'dev.db')}`;
    const dbUrl = process.env.DATABASE_URL || defaultUrl;

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to Database via Prisma.');
    } catch (error: any) {
      this.logger.warn(`⚠️ Prisma connection notice: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {}
  }
}
