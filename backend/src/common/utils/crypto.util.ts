import * as crypto from 'crypto';

export class CryptoUtil {
  /**
   * Generates a cryptographically secure 6-digit numeric OTP string.
   */
  static generateNumericOtp(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes[i] % 10];
    }
    return otp;
  }

  /**
   * Hashes an OTP code using HMAC-SHA256 with a secret salt.
   * Ensures raw OTP codes are NEVER stored in plain text.
   */
  static hashOtp(otpCode: string, secretSalt?: string): string {
    const secret = secretSalt || process.env.OTP_HMAC_SECRET || 'fallback_secret_otp_2026';
    return crypto.createHmac('sha256', secret).update(otpCode).digest('hex');
  }

  /**
   * Generates a unique API key with prefix (e.g., otp_live_... or otp_test_...)
   * Returns both rawKey (to present to user once) and keyHash (stored in DB).
   */
  static generateApiKey(type: 'LIVE' | 'TEST' = 'LIVE'): { rawKey: string; keyPrefix: string; keyHash: string } {
    const randomHex = crypto.randomBytes(24).toString('hex');
    const prefix = type === 'LIVE' ? 'otp_live' : 'otp_test';
    const keyPrefix = `${prefix}_${randomHex.slice(0, 8)}`;
    const rawKey = `${keyPrefix}_${randomHex.slice(8)}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    return { rawKey, keyPrefix, keyHash };
  }

  /**
   * Hashes a raw API key string to compare with stored hash.
   */
  static hashApiKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey).digest('hex');
  }

  /**
   * Generates an HMAC-SHA256 signature for Webhook payloads.
   */
  static generateWebhookSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
}
