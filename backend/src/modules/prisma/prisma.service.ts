import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to PostgreSQL Database via Prisma.');
    } catch (error: any) {
      this.logger.warn(`⚠️ PostgreSQL connection pending/unavailable on localhost: ${error.message}`);
      this.logger.warn(`💡 Tip: When deploying to cloud (Render / VPS Docker), PostgreSQL will connect automatically.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
