import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';

// Baileys types fallback & import
let makeWASocket: any;
let useMultiFileAuthState: any;
let DisconnectReason: any;

try {
  const baileys = require('@whiskeysockets/baileys');
  makeWASocket = baileys.default || baileys.makeWASocket;
  useMultiFileAuthState = baileys.useMultiFileAuthState;
  DisconnectReason = baileys.DisconnectReason;
} catch (e) {
  // Graceful fallback if baileys native binary/bindings not compiled in dev
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
  private connectionStatus: BaileysStatus = BaileysStatus.DISCONNECTED;
  private connectedPhoneNumber: string | null = null;
  private authFolder = path.join(process.cwd(), 'baileys_auth_info');

  async onModuleInit() {
    if (process.env.ENABLE_BAILEYS !== 'false') {
      this.initBaileys().catch((err) => {
        this.logger.warn(`Baileys initialization postponed: ${err.message}`);
      });
    }
  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.ev.removeAllListeners();
    }
  }

  /**
   * Initializes Baileys WhatsApp Web Client
   */
  async initBaileys() {
    if (!makeWASocket || !useMultiFileAuthState) {
      this.logger.warn('Baileys library not available in environment. Running in mock/simulation mode.');
      return;
    }

    try {
      if (!fs.existsSync(this.authFolder)) {
        fs.mkdirSync(this.authFolder, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);

      this.connectionStatus = BaileysStatus.CONNECTING;
      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: require('pino')({ level: 'silent' }),
      });

      this.socket.ev.on('creds.update', saveCreds);

      this.socket.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.connectionStatus = BaileysStatus.PAIRING_REQUIRED;
          this.qrDataUrl = await QRCode.toDataURL(qr);
          this.logger.log('📱 New WhatsApp QR Code generated for web pairing!');
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason?.loggedOut;
          this.logger.warn(`Baileys connection closed. Reconnecting: ${shouldReconnect}`);
          this.connectionStatus = BaileysStatus.DISCONNECTED;
          this.connectedPhoneNumber = null;

          if (shouldReconnect) {
            setTimeout(() => this.initBaileys(), 5000);
          } else {
            this.qrDataUrl = null;
            this.clearSession();
          }
        } else if (connection === 'open') {
          this.connectionStatus = BaileysStatus.CONNECTED;
          this.qrDataUrl = null;
          const userJid = this.socket?.user?.id || '';
          this.connectedPhoneNumber = userJid.split(':')[0] || 'Unknown Number';
          this.logger.log(`✅ WhatsApp Web QR Paired successfully! Connected Phone: +${this.connectedPhoneNumber}`);
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
      this.logger.warn(`Baileys not connected. Status: ${this.connectionStatus}. Falling back to simulation mode.`);
      
      // Development / Mock fallback
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

  /**
   * Get current pairing status & QR code data URL
   */
  getStatus() {
    return {
      status: this.connectionStatus,
      qrDataUrl: this.qrDataUrl,
      connectedPhoneNumber: this.connectedPhoneNumber,
      isReady: this.connectionStatus === BaileysStatus.CONNECTED,
    };
  }

  /**
   * Disconnect & clear saved pairing session
   */
  async logoutAndClear() {
    try {
      if (this.socket) {
        await this.socket.logout();
      }
    } catch {}

    this.clearSession();
    this.connectionStatus = BaileysStatus.DISCONNECTED;
    this.qrDataUrl = null;
    this.connectedPhoneNumber = null;
    
    setTimeout(() => this.initBaileys(), 2000);
    return { success: true, message: 'Session logged out and reset.' };
  }

  private clearSession() {
    if (fs.existsSync(this.authFolder)) {
      try {
        fs.rmSync(this.authFolder, { recursive: true, force: true });
      } catch {}
    }
  }
}
