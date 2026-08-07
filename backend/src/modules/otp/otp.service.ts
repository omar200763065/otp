import { Injectable, BadRequestException, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { SecurityService } from '../security/security.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { SendOtpDto, VerifyOtpDto, ResendOtpDto, CancelOtpDto } from './dto/otp.dto';
import { OtpStatus } from '../../common/enums';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  // In-memory fallback store when local PostgreSQL database is offline
  private inMemoryStore = new Map<string, {
    transactionId: string;
    phoneNumber: string;
    otpHash: string;
    rawCode: string;
    attempts: number;
    maxAttempts: number;
    resendCount: number;
    expiresAt: Date;
    createdAt: Date;
    status: string;
  }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsAppService: WhatsAppService,
    private readonly securityService: SecurityService,
  ) {}

  /**
   * Generates and dispatches a new OTP code via WhatsApp/SMS
   */
  async sendOtp(dto: SendOtpDto, appId: string, clientIp: string, userAgent?: string) {
    const { phoneNumber, templateName, language = 'ar', deviceFingerprint } = dto;

    await this.securityService.validateRequestSecurity(clientIp, phoneNumber);

    const rawOtpCode = CryptoUtil.generateNumericOtp(6);
    const otpHash = CryptoUtil.hashOtp(rawOtpCode);
    const expirationMinutes = Number(process.env.OTP_EXPIRATION_MINUTES) || 5;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 3;
    const txId = `tx_${Date.now()}`;

    // Try database persistence first
    try {
      const existingPending = await this.prisma.otpTransaction.findFirst({
        where: { appId, phoneNumber, status: OtpStatus.PENDING },
        orderBy: { createdAt: 'desc' },
      });

      if (existingPending) {
        await this.prisma.otpTransaction.update({
          where: { id: existingPending.id },
          data: { status: OtpStatus.CANCELLED },
        });
      }

      await this.prisma.otpTransaction.create({
        data: {
          appId,
          phoneNumber,
          channel: dto.channel || 'WHATSAPP',
          otpHash,
          status: OtpStatus.PENDING,
          expiresAt,
          ipAddress: clientIp,
          userAgent,
          deviceFingerprint,
          maxAttempts,
        },
      });
    } catch (error) {
      this.logger.warn(`Database offline. Saving OTP transaction in memory for ${phoneNumber}...`);
    }

    // Always update in-memory store for fallback
    this.inMemoryStore.set(phoneNumber, {
      transactionId: txId,
      phoneNumber,
      otpHash,
      rawCode: rawOtpCode,
      attempts: 0,
      maxAttempts,
      resendCount: 0,
      expiresAt,
      createdAt: new Date(),
      status: 'PENDING',
    });

    // Dispatch WhatsApp OTP Message
    const delivery = await this.whatsAppService.sendOtpMessage({
      toPhoneNumber: phoneNumber,
      otpCode: rawOtpCode,
      templateName,
      languageCode: language,
    });

    this.logger.log(`OTP (${rawOtpCode}) dispatched to ${phoneNumber}`);

    return {
      success: true,
      transactionId: txId,
      phoneNumber,
      expiresAt,
      cooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
      message: 'تم إرسال رمز التحقق بنجاح عبر WhatsApp.',
    };
  }

  /**
   * Verifies an OTP code provided by the user
   */
  async verifyOtp(dto: VerifyOtpDto, appId: string, clientIp: string) {
    const { phoneNumber, code } = dto;

    await this.securityService.validateRequestSecurity(clientIp, phoneNumber);

    let memTx = this.inMemoryStore.get(phoneNumber);

    // Try DB verification first
    try {
      const dbTx = await this.prisma.otpTransaction.findFirst({
        where: { appId, phoneNumber, status: OtpStatus.PENDING },
        orderBy: { createdAt: 'desc' },
      });

      if (dbTx) {
        if (new Date() > new Date(dbTx.expiresAt)) {
          await this.prisma.otpTransaction.update({ where: { id: dbTx.id }, data: { status: OtpStatus.EXPIRED } });
          throw new BadRequestException({ statusCode: 400, message: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.' });
        }

        const inputHash = CryptoUtil.hashOtp(code);
        if (inputHash === dbTx.otpHash) {
          await this.prisma.otpTransaction.update({ where: { id: dbTx.id }, data: { status: OtpStatus.VERIFIED, verifiedAt: new Date() } });
          return { success: true, message: 'تم التحقق من رمز OTP بنجاح.', verifiedAt: new Date(), phoneNumber };
        }
      }
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
    }

    // In-memory verification fallback
    if (!memTx || memTx.status !== 'PENDING') {
      throw new NotFoundException({ statusCode: 404, message: 'لا يوجد رمز تحقق نشط لهذا الرقم. يرجى طلب رمز جديد.' });
    }

    if (new Date() > memTx.expiresAt) {
      memTx.status = 'EXPIRED';
      throw new BadRequestException({ statusCode: 400, message: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.' });
    }

    const inputHash = CryptoUtil.hashOtp(code);
    if (inputHash !== memTx.otpHash && code !== memTx.rawCode) {
      memTx.attempts += 1;
      const remaining = memTx.maxAttempts - memTx.attempts;
      if (remaining <= 0) {
        memTx.status = 'FAILED';
        throw new ForbiddenException({ statusCode: 403, message: 'تجاوزت الحد الأقصى للمحاولات الخاطئة.' });
      }
      throw new BadRequestException({ statusCode: 400, message: `رمز التحقق غير صحيح. متبقي ${remaining} محاولة.` });
    }

    memTx.status = 'VERIFIED';
    this.logger.log(`OTP Verified successfully for ${phoneNumber}`);

    return {
      success: true,
      message: 'تم التحقق من رمز OTP بنجاح.',
      verifiedAt: new Date(),
      phoneNumber,
    };
  }

  /**
   * Resends OTP code for an active pending transaction
   */
  async resendOtp(dto: ResendOtpDto, appId: string, clientIp: string) {
    return this.sendOtp({ phoneNumber: dto.phoneNumber }, appId, clientIp);
  }

  /**
   * Cancels a pending OTP transaction
   */
  async cancelOtp(dto: CancelOtpDto, appId: string) {
    const memTx = this.inMemoryStore.get(dto.phoneNumber);
    if (memTx) memTx.status = 'CANCELLED';

    try {
      const transaction = await this.prisma.otpTransaction.findFirst({
        where: { appId, phoneNumber: dto.phoneNumber, status: OtpStatus.PENDING },
      });
      if (transaction) {
        await this.prisma.otpTransaction.update({
          where: { id: transaction.id },
          data: { status: OtpStatus.CANCELLED },
        });
      }
    } catch {}

    return { success: true, message: 'تم إلغاء رمز التحقق بنجاح.' };
  }

  /**
   * Get recent logs
   */
  async getLogs(appId: string, limit: number = 50) {
    try {
      return await this.prisma.otpTransaction.findMany({
        where: { appId },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return Array.from(this.inMemoryStore.values()).slice(0, limit);
    }
  }
}
