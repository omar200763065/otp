import { Controller, Post, Get, Body, UseGuards, Request, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto, ResendOtpDto, CancelOtpDto } from './dto/otp.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@ApiTags('OTP Service')
@ApiHeader({ name: 'x-api-key', description: 'App Live or Test API Key (e.g. otp_live_...)', required: true })
@UseGuards(ApiKeyGuard)
@Controller('api/v1')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @ApiOperation({ summary: 'Send OTP code via WhatsApp' })
  @ApiResponse({ status: 200, description: 'OTP generated and dispatched successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto, @Request() req: any) {
    const appId = req.appEntity.id;
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'];
    return this.otpService.sendOtp(dto, appId, clientIp, userAgent);
  }

  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Request() req: any) {
    const appId = req.appEntity.id;
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    return this.otpService.verifyOtp(dto, appId, clientIp);
  }

  @ApiOperation({ summary: 'Resend OTP code' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto, @Request() req: any) {
    const appId = req.appEntity.id;
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    return this.otpService.resendOtp(dto, appId, clientIp);
  }

  @ApiOperation({ summary: 'Cancel pending OTP code' })
  @ApiResponse({ status: 200, description: 'OTP cancelled' })
  @HttpCode(HttpStatus.OK)
  @Post('cancel-otp')
  async cancelOtp(@Body() dto: CancelOtpDto, @Request() req: any) {
    const appId = req.appEntity.id;
    return this.otpService.cancelOtp(dto, appId);
  }

  @ApiOperation({ summary: 'Check Platform API Status' })
  @Get('status')
  async getStatus(@Request() req: any) {
    return {
      status: 'ONLINE',
      platform: 'Enterprise OTP SaaS Engine',
      app: req.appEntity.name,
      tenant: req.tenantEntity.name,
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: 'Get OTP transactions log history for current App' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @Get('logs')
  async getLogs(@Request() req: any, @Query('limit') limit?: number) {
    const appId = req.appEntity.id;
    return this.otpService.getLogs(appId, limit ? Number(limit) : 50);
  }
}
