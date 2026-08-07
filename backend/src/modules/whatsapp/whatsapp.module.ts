import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { BaileysService } from './baileys.service';
import { WhatsAppController } from './whatsapp.controller';

@Module({
  controllers: [WhatsAppController],
  providers: [WhatsAppService, BaileysService],
  exports: [WhatsAppService, BaileysService],
})
export class WhatsAppModule {}
