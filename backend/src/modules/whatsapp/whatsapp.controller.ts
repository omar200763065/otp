import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsAppService, WhatsAppProviderMode } from './whatsapp.service';
import { BaileysService } from './baileys.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';

@ApiTags('Admin WhatsApp Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller(['admin/whatsapp', 'api/admin/whatsapp', 'whatsapp'])
export class WhatsAppController {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    private readonly baileysService: BaileysService,
  ) {}

  @ApiOperation({ summary: 'Get WhatsApp Provider status and QR Code status' })
  @Get('status')
  async getStatus() {
    const providerMode = this.whatsAppService.getProviderMode();
    const baileysStatus = this.baileysService.getStatus();

    return {
      providerMode,
      baileys: baileysStatus,
    };
  }

  @ApiOperation({ summary: 'Switch WhatsApp Provider Mode (BAILEYS_QR vs META_CLOUD_API)' })
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('provider')
  async switchProvider(@Body() body: { mode: WhatsAppProviderMode }) {
    return this.whatsAppService.setProviderMode(body.mode);
  }

  @ApiOperation({ summary: 'Disconnect and clear Baileys WhatsApp QR Session' })
  @Roles(Role.ADMIN)
  @Post('disconnect')
  async disconnectBaileys() {
    return this.baileysService.logoutAndClear();
  }
}
