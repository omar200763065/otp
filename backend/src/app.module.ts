import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { AppsModule } from './modules/apps/apps.module';
import { OtpModule } from './modules/otp/otp.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { SecurityModule } from './modules/security/security.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    PrismaModule,
    AuthModule,
    ApiKeyModule,
    AppsModule,
    OtpModule,
    WhatsAppModule,
    SecurityModule,
    DashboardModule,
  ],
})
export class AppModule {}
