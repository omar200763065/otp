import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin Dashboard Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['admin/dashboard', 'api/admin/dashboard', 'dashboard'])
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get SaaS Platform Overview Analytics & System Health' })
  @Get(['overview', ''])
  async getOverview() {
    return this.dashboardService.getOverviewStats();
  }
}
