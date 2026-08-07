import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [WhatsAppModule, SecurityModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
