import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IpRuleType } from '../../common/enums';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async validateRequestSecurity(clientIp: string, phoneNumber?: string): Promise<void> {
    try {
      const blacklistedIp = await this.prisma.ipRule.findFirst({
        where: {
          type: IpRuleType.BLACKLIST,
          value: clientIp,
          isActive: true,
        },
      });

      if (blacklistedIp) {
        this.logger.warn(`Blocked request from blacklisted IP: ${clientIp}`);
        throw new ForbiddenException(`Access denied: IP ${clientIp} is blacklisted.`);
      }

      if (phoneNumber) {
        const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
        const blacklistedPhone = await this.prisma.ipRule.findFirst({
          where: {
            type: IpRuleType.BLACKLIST,
            value: { equals: cleanPhone },
            isActive: true,
          },
        });

        if (blacklistedPhone) {
          this.logger.warn(`Blocked request for blacklisted phone: ${cleanPhone}`);
          throw new ForbiddenException(`Access denied: Phone number ${cleanPhone} is blacklisted.`);
        }
      }
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      // Allow request if DB is offline locally
    }
  }

  async createAuditLog(options: {
    userId?: string;
    userEmail?: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: options.userId,
          userEmail: options.userEmail,
          action: options.action,
          resource: options.resource,
          details: options.details ? JSON.stringify(options.details) : undefined,
          ipAddress: options.ipAddress,
        },
      });
    } catch (error: any) {
      this.logger.warn(`Failed to record audit log (DB offline): ${error.message}`);
    }
  }
}
