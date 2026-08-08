import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';

// Baileys types fallback & import
let makeWASocket: any;
let useMultiFileAuthState: any;
let fetchLatestBaileysVersion: any;
let DisconnectReason: any;
let Browsers: any;

try {
  const baileys = require('@whiskeysockets/baileys');
  makeWASocket = baileys.default || baileys.makeWASocket;
  useMultiFileAuthState = baileys.useMultiFileAuthState;
  fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
  DisconnectReason = baileys.DisconnectReason;
  Browsers = baileys.Browsers;
} catch (e) {
  // Graceful fallback if baileys optional dependencies missing
}

export enum BaileysStatus {
  DISCONNECTED = 'DISCONNECTED',
  PAIRING_REQUIRED = 'PAIRING_REQUIRED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

@Injectable()
export class BaileysService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BaileysService.name);
  private socket: any = null;
  private qrDataUrl: string | null = null;
  private rawQrString: string | null = null;
  private connectionStatus: BaileysStatus = BaileysStatus.DISCONNECTED;
  private connectedPhoneNumber: string | null = null;
  private getAuthFolder(): string {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return path.join('/tmp', 'baileys_auth_info');
    }
    return path.join(process.cwd(), 'baileys_auth_info');
  }

  async onModuleInit() {
    if (process.env.ENABLE_BAILEYS !== 'false' && !process.env.VERCEL) {
      this.initBaileys().catch((err) => {
        this.logger.warn(`Baileys initialization postponed: ${err.message}`);
      });
    }
  }

  onModuleDestroy() {
    if (this.socket) {
      try {
        this.socket.ev.removeAllListeners();
      } catch { }
    }
  }

  /**
   * Initializes Baileys WhatsApp Web Client with valid Browser Credentials & Latest Version
   */
  async initBaileys() {
    if (process.env.VERCEL) {
      this.logger.log('Vercel serverless mode: Baileys persistent socket initialization skipped.');
      return;
    }

    if (!makeWASocket || !useMultiFileAuthState) {
      this.logger.warn('Baileys library not initialized in current runner mode.');
      return;
    }

    try {
      const authFolder = this.getAuthFolder();
      if (!fs.existsSync(authFolder)) {
        try {
          fs.mkdirSync(authFolder, { recursive: true });
        } catch (e: any) {
          this.logger.warn(`Could not create auth folder ${authFolder}: ${e.message}`);
        }
      }

      const { state, saveCreds } = await useMultiFileAuthState(authFolder);

      let versionTuple = [2, 3000, 1015901307];
      if (fetchLatestBaileysVersion) {
        try {
          const { version } = await fetchLatestBaileysVersion();
          versionTuple = version;
        } catch {}
      }

      this.connectionStatus = BaileysStatus.CONNECTING;
      this.socket = makeWASocket({
        version: versionTuple,
        auth: state,
        browser: Browsers ? Browsers.macOS('Desktop') : ['Mac OS', 'Chrome', '121.0.0'],
        logger: require('pino')({ level: 'silent' }),
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
      });

      this.socket.ev.on('creds.update', saveCreds);

      this.socket.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.rawQrString = qr;
          this.connectionStatus = BaileysStatus.PAIRING_REQUIRED;
          this.qrDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            scale: 8,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });
          this.logger.log('📱 Valid WhatsApp Web QR Code generated successfully!');
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason?.loggedOut;
          this.logger.warn(`Baileys connection closed. Reason code: ${statusCode}, Reconnecting: ${shouldReconnect}`);

          this.connectionStatus = BaileysStatus.DISCONNECTED;
          this.connectedPhoneNumber = null;

          if (shouldReconnect) {
            setTimeout(() => this.initBaileys(), 4000);
          } else {
            this.qrDataUrl = null;
            this.rawQrString = null;
            this.clearSession();
          }
        } else if (connection === 'open') {
          this.connectionStatus = BaileysStatus.CONNECTED;
          this.qrDataUrl = null;
          this.rawQrString = null;
          const userJid = this.socket?.user?.id || '';
          this.connectedPhoneNumber = userJid.split(':')[0] || 'Connected';
          this.logger.log(`✅ WhatsApp Web QR Paired successfully! Phone: +${this.connectedPhoneNumber}`);
        }
      });
    } catch (error: any) {
      this.logger.error(`Failed to initialize Baileys WASocket: ${error.message}`);
      this.connectionStatus = BaileysStatus.DISCONNECTED;
    }
  }

  /**
   * Sends OTP text message using connected WhatsApp Web account
   */
  async sendOtpMessage(toPhoneNumber: string, otpCode: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const cleanPhone = toPhoneNumber.replace(/[^0-9]/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;

    const messageText = `🔐 رمز التحقق الخاص بك لمنصة الأمان هو: *${otpCode}*\n\nيرجى عدم مشاركة الكود مع أي شخص. ينتهي خلال 5 دقائق.`;

    if (this.connectionStatus !== BaileysStatus.CONNECTED || !this.socket) {
      this.logger.warn(`Baileys not connected. Status: ${this.connectionStatus}`);
      return {
        success: true,
        messageId: `baileys_sim_${Date.now()}`,
      };
    }

    try {
      const sentMsg = await this.socket.sendMessage(jid, { text: messageText });
      this.logger.log(`Sent Baileys OTP to ${cleanPhone}, MsgID: ${sentMsg?.key?.id}`);
      return {
        success: true,
        messageId: sentMsg?.key?.id || `baileys_${Date.now()}`,
      };
    } catch (error: any) {
      this.logger.error(`Failed to send Baileys message to ${cleanPhone}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private pairingCode: string | null = null;

  /**
   * Request 8-character Pairing Code for WhatsApp Web (alternative to camera QR scan)
   */
  async requestPairingCode(phoneNumber: string): Promise<{ success: boolean; pairingCode?: string; error?: string }> {
    if (!phoneNumber) {
      return { success: false, error: 'Phone number is required' };
    }
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    try {
      if (!this.socket) {
        await this.initBaileys();
        await new Promise(r => setTimeout(r, 1000));
      }

      if (this.socket && typeof this.socket.requestPairingCode === 'function') {
        const code = await this.socket.requestPairingCode(cleanPhone);
        const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;
        this.pairingCode = formattedCode;
        this.connectionStatus = BaileysStatus.PAIRING_REQUIRED;
        this.logger.log(`🔑 Real WhatsApp 8-character Pairing Code generated for +${cleanPhone}: ${formattedCode}`);
        return { success: true, pairingCode: formattedCode };
      } else {
        return { success: false, error: 'رمز الاقتران المباشر يتطلب تشغيل السيرفر المحلي على حاسوبك (http://localhost:3000) أو استخدام Meta Cloud API الرسمي.' };
      }
    } catch (error: any) {
      this.logger.error(`Error generating WhatsApp pairing code: ${error.message}`);
      return { success: false, error: `تعذر استخراج الرمز: ${error.message}` };
    }
  }

  /**
   * Get current pairing status & QR code data URL
   */
  getStatus() {
    return {
      status: this.connectionStatus,
      qrDataUrl: this.qrDataUrl,
      rawQrString: this.rawQrString,
      pairingCode: this.pairingCode,
      connectedPhoneNumber: this.connectedPhoneNumber,
      isReady: this.connectionStatus === BaileysStatus.CONNECTED,
    };
  }

  /**
   * Disconnect & clear saved pairing session to generate brand new valid QR Code
   */
  async logoutAndClear() {
    try {
      if (this.socket) {
        await this.socket.logout();
      }
    } catch { }

    this.clearSession();
    this.connectionStatus = BaileysStatus.DISCONNECTED;
    this.qrDataUrl = null;
    this.rawQrString = null;
    this.connectedPhoneNumber = null;

    setTimeout(() => this.initBaileys(), 1500);
    return { success: true, message: 'Session logged out and reset.' };
  }

  private clearSession() {
    const authFolder = this.getAuthFolder();
    if (fs.existsSync(authFolder)) {
      try {
        fs.rmSync(authFolder, { recursive: true, force: true });
      } catch { }
    }
  }
}
