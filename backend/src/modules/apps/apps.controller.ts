import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppsService } from './apps.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';

@ApiTags('Admin Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @ApiOperation({ summary: 'List all client applications' })
  @Get()
  async findAll() {
    return this.appsService.findAll();
  }

  @ApiOperation({ summary: 'Create a new client application' })
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post()
  async create(@Body() body: { name: string; slug: string; description?: string }) {
    return this.appsService.create(body);
  }

  @ApiOperation({ summary: 'Toggle application active status' })
  @Roles(Role.ADMIN)
  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    return this.appsService.toggleActive(id);
  }
}
