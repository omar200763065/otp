import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsAppService, WhatsAppProviderMode } from './whatsapp.service';
import { BaileysService } from './baileys.service';

@ApiTags('Admin WhatsApp Management')
@Controller(['admin/whatsapp', 'api/admin/whatsapp', 'whatsapp', 'api/whatsapp'])
export class WhatsAppController {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    private readonly baileysService: BaileysService,
  ) {}

  @ApiOperation({ summary: 'Get WhatsApp Provider status and QR Code status' })
  @Get(['status', ''])
  async getStatus() {
    const providerMode = this.whatsAppService.getProviderMode();
    const baileysStatus = this.baileysService.getStatus();

    return {
      providerMode,
      baileys: baileysStatus,
    };
  }

  @ApiOperation({ summary: 'Switch WhatsApp Provider Mode (BAILEYS_QR vs META_CLOUD_API)' })
  @Post('provider')
  async switchProvider(@Body() body: { mode: WhatsAppProviderMode }) {
    return this.whatsAppService.setProviderMode(body.mode);
  }

  @ApiOperation({ summary: 'Generate 8-character WhatsApp Pairing Code' })
  @Post(['pairing-code', 'pair'])
  async requestPairingCode(@Body() body: { phoneNumber: string }) {
    return this.baileysService.requestPairingCode(body.phoneNumber);
  }

  @ApiOperation({ summary: 'Disconnect and clear Baileys WhatsApp QR Session' })
  @Post('disconnect')
  async disconnectBaileys() {
    return this.baileysService.logoutAndClear();
  }
}
