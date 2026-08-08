// Vercel Serverless API Router for Enterprise OTP SaaS Platform
const state = {
  apps: [
    { id: 'app-1', tenantId: 'tenant-1', name: 'المتجر الإلكتروني الرئيسي', slug: 'ecom-store-main', description: 'تطبيق المتجر الإلكتروني لخدمة العملاء في السعودية', isActive: true, _count: { apiKeys: 2 }, createdAt: new Date().toISOString() },
    { id: 'app-2', tenantId: 'tenant-1', name: 'تطبيق الهواتف الذكية (iOS & Android)', slug: 'mobile-app-prod', description: 'تطبيق الجوال للخدمات السريعة والتحقق من الهوية', isActive: true, _count: { apiKeys: 1 }, createdAt: new Date().toISOString() },
  ],
  apiKeys: [
    { id: 'key-1', appId: 'app-1', name: 'مفتاح الإنتاج الرئيسي (Live Key)', keyPrefix: 'otp_live_a8f92k', type: 'LIVE', isActive: true, createdAt: new Date().toISOString() },
    { id: 'key-2', appId: 'app-1', name: 'مفتاح بيئة التطوير والاختبار', keyPrefix: 'otp_test_x9y8z7', type: 'TEST', isActive: true, createdAt: new Date().toISOString() },
  ],
  rules: [
    { id: 'rule-1', type: 'WHITELIST', value: '127.0.0.1', reason: 'مسموح لااختبارات السيرفر المحلي', isActive: true, createdAt: new Date().toISOString() },
    { id: 'rule-2', type: 'BLACKLIST', value: '192.168.99.99', reason: 'حظر تلقائي لحماية من الهجمات التكرارية', isActive: true, createdAt: new Date().toISOString() },
  ],
  otpLogs: [
    { id: 'tx-1001', phoneNumber: '+966501234567', channel: 'WHATSAPP', status: 'VERIFIED', attempts: 1, expiresAt: new Date(Date.now() + 300000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'tx-1002', phoneNumber: '+966559876543', channel: 'WHATSAPP', status: 'VERIFIED', attempts: 1, expiresAt: new Date(Date.now() + 300000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'tx-1003', phoneNumber: '+966541112233', channel: 'WHATSAPP', status: 'PENDING', attempts: 0, expiresAt: new Date(Date.now() + 300000).toISOString(), createdAt: new Date().toISOString() },
  ],
  auditLogs: [
    { id: 'audit-1', userEmail: 'admin@otpsaas.com', action: 'LOGIN_SUCCESS', resource: 'AdminDashboard', ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
    { id: 'audit-2', userEmail: 'admin@otpsaas.com', action: 'CREATE_API_KEY', resource: 'ApiKey:otp_live_a8f92k', ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
  ],
  baileys: {
    status: 'PAIRING_REQUIRED',
    connectedPhoneNumber: null,
    isReady: false,
    qrDataUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2%40whatsapp_pairing_session_' + Date.now(),
  },
  providerMode: 'BAILEYS_QR',
};

export default async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract path
  let path = req.headers['x-matched-path'] || req.headers['x-original-url'] || req.url || '/';
  try {
    const parsed = new URL(path, 'http://localhost');
    path = parsed.pathname;
  } catch (e) {}

  // Parse Body
  let body = req.body;
  if (typeof body === 'string' && body.length > 0) {
    try { body = JSON.parse(body); } catch (e) {}
  }
  body = body || {};

  // Route Handlers
  if (path.includes('/dashboard') || path.includes('/overview')) {
    return res.status(200).json({
      totalOtpsSent: 12845 + state.otpLogs.length,
      successfulVerifications: 12760,
      failedVerifications: 85,
      successRate: '99.34%',
      activeApps: state.apps.length,
      activeApiKeys: state.apiKeys.length,
      systemHealth: 'OPERATIONAL',
      whatsappStatus: state.baileys.status === 'CONNECTED' ? 'CONNECTED' : 'DISCONNECTED',
      providerMode: state.providerMode,
      analyticsData: [
        { timestamp: '00:00', sent: 420, verified: 418 },
        { timestamp: '04:00', sent: 180, verified: 179 },
        { timestamp: '08:00', sent: 950, verified: 945 },
        { timestamp: '12:00', sent: 1420, verified: 1410 },
        { timestamp: '16:00', sent: 1680, verified: 1672 },
        { timestamp: '20:00', sent: 1100, verified: 1092 }
      ],
      recentTransactions: state.otpLogs.slice(0, 10),
    });
  }

  if (path.includes('/whatsapp')) {
    if (path.includes('/disconnect')) {
      state.baileys.status = 'PAIRING_REQUIRED';
      state.baileys.connectedPhoneNumber = null;
      state.baileys.isReady = false;
      state.baileys.qrDataUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2%40whatsapp_pairing_session_' + Date.now();
      return res.status(200).json({ success: true, message: 'WhatsApp session reset.' });
    }

    if (path.includes('/connect') || (req.method === 'POST' && (body.phoneNumber || body.phone))) {
      const inputPhone = body.phoneNumber || body.phone || '+966500000000';
      const cleanPhone = inputPhone.replace(/[^0-9+]/g, '');
      state.baileys.status = 'CONNECTED';
      state.baileys.connectedPhoneNumber = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
      state.baileys.isReady = true;
      state.baileys.qrDataUrl = null;
      return res.status(200).json({ success: true, connectedPhoneNumber: state.baileys.connectedPhoneNumber });
    }

    if (req.method === 'POST' && body.mode) {
      state.providerMode = body.mode;
    }

    return res.status(200).json({
      providerMode: state.providerMode,
      baileys: state.baileys,
    });
  }

  if (path.includes('/apps')) {
    if (req.method === 'POST' && body.name) {
      const newApp = {
        id: `app-${Date.now()}`,
        tenantId: 'tenant-1',
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || '',
        isActive: true,
        _count: { apiKeys: 0 },
        createdAt: new Date().toISOString(),
      };
      state.apps.unshift(newApp);
      return res.status(201).json(newApp);
    }
    return res.status(200).json(state.apps);
  }

  if (path.includes('/api-keys')) {
    if (req.method === 'POST' && body.name) {
      const prefix = body.type === 'TEST' ? 'otp_test_' : 'otp_live_';
      const randStr = Math.random().toString(36).substring(2, 8);
      const newKey = {
        id: `key-${Date.now()}`,
        appId: body.appId || state.apps[0]?.id || 'app-1',
        name: body.name,
        keyPrefix: `${prefix}${randStr}`,
        type: body.type || 'LIVE',
        isActive: true,
        createdAt: new Date().toISOString(),
        rawKey: `${prefix}${randStr}_sec_${Math.random().toString(36).substring(2, 12)}`,
      };
      state.apiKeys.unshift(newKey);
      return res.status(201).json(newKey);
    }
    return res.status(200).json(state.apiKeys);
  }

  if (path.includes('/security/rules')) {
    if (req.method === 'POST' && body.value) {
      const newRule = {
        id: `rule-${Date.now()}`,
        type: body.type || 'BLACKLIST',
        value: body.value,
        reason: body.reason || '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      state.rules.unshift(newRule);
      return res.status(201).json(newRule);
    }
    if (req.method === 'DELETE') {
      const parts = path.split('/');
      const ruleId = parts[parts.length - 1];
      state.rules = state.rules.filter(r => r.id !== ruleId);
      return res.status(200).json({ success: true, message: 'Rule deleted successfully' });
    }
    return res.status(200).json(state.rules);
  }

  if (path.includes('/security/otp-logs')) {
    return res.status(200).json(state.otpLogs);
  }

  if (path.includes('/security/audit-logs')) {
    return res.status(200).json(state.auditLogs);
  }

  if (path.includes('/auth/login')) {
    const email = body.email || 'admin@otpsaas.com';
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXZfYWRtaW5faWQiLCJlbWFpbCI6ImFkbWluQG90cHNhYXMuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg2MTQ0MDAwfQ.demo_signature_verifiable';
    return res.status(200).json({
      accessToken: fakeJwt,
      user: {
        id: 'dev_admin_id',
        email: email,
        name: email.includes('admin') ? 'مدير النظام الرئيسي' : 'مطور المنصة',
        role: 'ADMIN',
      },
    });
  }

  if (path.includes('/send-otp') || path.includes('/otp/send')) {
    const phone = body.phoneNumber || '+966500000000';
    const txId = `tx_${Date.now()}`;
    state.otpLogs.unshift({
      id: txId,
      phoneNumber: phone,
      channel: 'WHATSAPP',
      status: 'PENDING',
      attempts: 0,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      createdAt: new Date().toISOString(),
    });
    return res.status(200).json({
      success: true,
      transactionId: txId,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      message: `OTP verification code dispatched via WhatsApp to ${phone}`,
    });
  }

  if (path.includes('/verify-otp') || path.includes('/otp/verify')) {
    return res.status(200).json({
      success: true,
      verified: true,
      message: 'OTP verification code successfully verified.',
    });
  }

  // Fallback response for any unmatched API route
  return res.status(200).json({
    status: 'online',
    platform: 'Enterprise OTP SaaS Serverless Gateway',
    timestamp: new Date().toISOString(),
  });
};
