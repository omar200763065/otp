import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, KeyType } from '@prisma/client';

@ApiTags('Admin API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiOperation({ summary: 'Get list of all API Keys' })
  @Get()
  async findAll() {
    return this.apiKeyService.findAll();
  }

  @ApiOperation({ summary: 'Generate a new API Key for an App' })
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post()
  async createKey(@Body() body: { appId: string; name: string; type?: KeyType }) {
    return this.apiKeyService.generateKey(body.appId, body.name, body.type);
  }

  @ApiOperation({ summary: 'Revoke/Deactivate an API Key' })
  @Roles(Role.ADMIN)
  @Patch(':id/revoke')
  async revokeKey(@Param('id') id: string) {
    return this.apiKeyService.revokeKey(id);
  }
}
