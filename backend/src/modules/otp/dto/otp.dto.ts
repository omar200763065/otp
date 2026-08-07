import { IsNotEmpty, IsString, IsOptional, IsEnum, Matches, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel } from '../../../common/enums';

export class SendOtpDto {
  @ApiProperty({ example: '+966500000000', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phoneNumber must be a valid E.164 international format (e.g. +966500000000)' })
  phoneNumber: string;

  @ApiPropertyOptional({ enum: Channel, default: Channel.WHATSAPP })
  @IsEnum(Channel)
  @IsOptional()
  channel?: Channel;

  @ApiPropertyOptional({ example: 'otp_verification_code' })
  @IsString()
  @IsOptional()
  templateName?: string;

  @ApiPropertyOptional({ example: 'ar', default: 'ar' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 'fp_browser_hash_123' })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+966500000000' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: '6-digit numeric OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: '+966500000000' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class CancelOtpDto {
  @ApiProperty({ example: '+966500000000' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
