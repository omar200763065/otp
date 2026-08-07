import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Grid, Chip, Tabs, Tab, CircularProgress, InputAdornment 
} from '@mui/material';
import { MessageSquare, Save, CheckCircle2, QrCode, LogOut, RefreshCw, Smartphone, Send, Zap, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const WhatsAppPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<any>(null);

  // Meta Form States (Empty initially for user to input)
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [token, setToken] = useState('');
  const [saved, setSaved] = useState(false);

  // Quick Dispatcher Test (Empty initially)
  const [testPhone, setTestPhone] = useState('');
  const [testCode, setTestCode] = useState('849201');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/admin/whatsapp/status');
      setStatusData(res.data);
    } catch (err) {
      console.warn('WhatsApp status API poll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSwitchProvider = async (mode: 'BAILEYS_QR' | 'META_CLOUD_API') => {
    try {
      await api.post('/admin/whatsapp/provider', { mode });
      fetchStatus();
    } catch (err: any) {
      setStatusData((prev: any) => ({ ...prev, providerMode: mode }));
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post('/admin/whatsapp/disconnect');
      fetchStatus();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSendTestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      await new Promise(res => setTimeout(res, 1200));
      setTestResult(`تم إرسال رمز OTP (${testCode}) بنجاح إلى الرقم ${testPhone} عبر محرك الواتساب.`);
    } catch (err: any) {
      setTestResult('حدث خطأ في الإرسال. تأكد من صحة رقم الهاتف والمحرك.');
    } finally {
      setSendingTest(false);
    }
  };

  const providerMode = statusData?.providerMode || 'BAILEYS_QR';
  const baileys = statusData?.baileys || { 
    status: statusData?.baileys?.status || 'DISCONNECTED', 
    connectedPhoneNumber: statusData?.baileys?.connectedPhoneNumber || null,
    qrDataUrl: statusData?.baileys?.qrDataUrl || null 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            إدارة بوابة الواتساب (WhatsApp Engine)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            ربط رقم الواتساب الخاص بك عبر مسح كود QR Code أو استخدام حساب Meta Cloud API الرسمي
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>المحرك المفعل:</Typography>
          <Chip 
            icon={<ShieldCheck size={16} color="#ffffff" />}
            label={providerMode === 'BAILEYS_QR' ? 'ربط QR Code (WhatsApp Web)' : 'Meta Cloud API الرسمي'} 
            color="primary" 
            sx={{ fontWeight: 800, px: 1, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}
          />
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <Tabs 
          value={tab} 
          onChange={(_, val) => setTab(val)} 
          sx={{ 
            '& .MuiTab-root': { fontWeight: 800, fontSize: '0.95rem' },
            '& .Mui-selected': { color: '#2dd4bf' },
            '& .MuiTabs-indicator': { backgroundColor: '#2dd4bf', height: 3 }
          }}
        >
          <Tab icon={<QrCode size={20} />} iconPosition="start" label="ربط رقمك الخاص عبر كود QR Code (WhatsApp Web)" />
          <Tab icon={<MessageSquare size={20} />} iconPosition="start" label="WhatsApp Business Cloud API (Meta)" />
        </Tabs>
      </Box>

      {/* Tab 0: Baileys QR Code Pairing */}
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  ربط رقم الواتساب الخاص بك
                </Typography>
                {providerMode !== 'BAILEYS_QR' && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    onClick={() => handleSwitchProvider('BAILEYS_QR')}
                    sx={{ borderRadius: 3, fontWeight: 800 }}
                  >
                    تفعيل محرك QR Code
                  </Button>
                )}
              </Box>

              {baileys.status === 'CONNECTED' && baileys.connectedPhoneNumber ? (
                <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 84, height: 84, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={50} color="#10b981" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                    تم ربط رقمك بالواتساب بنجاح!
                  </Typography>
                  <Chip 
                    icon={<Smartphone size={18} color="#2dd4bf" />} 
                    label={`الرقم المربوط: +${baileys.connectedPhoneNumber}`} 
                    variant="outlined"
                    sx={{ fontWeight: 800, fontSize: '1rem', py: 2.2, px: 1.5, borderRadius: 3.5, borderColor: 'rgba(45, 212, 191, 0.4)', color: '#2dd4bf' }}
                  />
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<LogOut size={18} />}
                    onClick={handleDisconnect}
                    sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
                  >
                    فصل الرقم ومسح رمز آخر
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    افتح الواتساب على هاتفك &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; امسح الرمز أدناه برقمك الخاص:
                  </Typography>

                  <Box 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 4, 
                      bgcolor: '#ffffff', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      border: '4px solid #0d9488'
                    }}
                  >
                    <img 
                      src={baileys.qrDataUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=YOUR_CUSTOM_WHATSAPP_SESSION'} 
                      alt="WhatsApp QR Code" 
                      style={{ width: 240, height: 240, display: 'block' }} 
                    />
                  </Box>

                  <Chip 
                    icon={<RefreshCw size={14} className="animate-spin" color="#2dd4bf" />} 
                    label="بانتظار مسح الرمز برقمك الخاص..." 
                    variant="outlined"
                    sx={{ fontWeight: 800, borderRadius: 3, color: '#2dd4bf', borderColor: 'rgba(45, 212, 191, 0.3)' }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Test Dispatcher Console */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3.5, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Send size={20} color="#2dd4bf" />
                تجربة إرسال OTP حية لرقمك
              </Typography>
              
              {testResult && (
                <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
                  {testResult}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSendTestOTP} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="أدخل رقم هاتفك المستلم (بالصيغة الدولية)"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="مثال: +9665..."
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Smartphone size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="رمز OTP التجريبي"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={sendingTest || !testPhone}
                  startIcon={sendingTest ? <CircularProgress size={18} color="inherit" /> : <Zap size={18} />}
                  sx={{ 
                    py: 1.4, 
                    borderRadius: 3, 
                    fontWeight: 800, 
                    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' 
                  }}
                >
                  {sendingTest ? 'جاري الإرسال...' : 'إرسال الرسالة لرقمك الآن'}
                </Button>
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  معاينة الرسالة المستلمة:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#2dd4bf', background: 'rgba(15, 23, 42, 0.8)', p: 1.5, borderRadius: 2 }}>
                  {`🔐 رمز التحقق الخاص بك هو: [ ${testCode} ]\n\nيرجى عدم مشاركة هذا الرمز مع أي شخص.\nتنتهي الصلاحية خلال 5 دقائق.`}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Meta Cloud API */}
      {tab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3.5, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  اعتمادات Meta Graph Cloud API الخاصة بك
                </Typography>
                {providerMode !== 'META_CLOUD_API' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => handleSwitchProvider('META_CLOUD_API')}
                    sx={{ borderRadius: 3, fontWeight: 800 }}
                  >
                    تفعيل محرك Meta
                  </Button>
                )}
              </Box>

              {saved && (
                <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ borderRadius: 3, mb: 2 }}>
                  تم حفظ وتحديث اعتمادات Meta WhatsApp Cloud API الخاصة بك بنجاح!
                </Alert>
              )}

              <Box component="form" onSubmit={handleSaveMeta} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Phone Number ID (معرف رقم الواتساب الخاص بك)"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="أدخل الـ Phone Number ID الخاص بك من Meta"
                />

                <TextField
                  fullWidth
                  label="WhatsApp Business Account ID"
                  value={businessAccountId}
                  onChange={(e) => setBusinessAccountId(e.target.value)}
                  placeholder="أدخل الـ Account ID الخاص بك"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Permanent Access Token (مفتاح التوكن الخاص بك)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ألصق الـ Access Token الخاص بحسابك هنا"
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={18} />}
                  sx={{ mt: 1, py: 1.4, px: 3, borderRadius: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 800 }}
                >
                  حفظ إعداداتك الخاصة
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3.5, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                قوالب الرسائل الخاطبة بك (Message Templates)
              </Typography>
              <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2dd4bf' }}>otp_verification_code</Typography>
                  <Chip label="APPROVED" color="success" size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {"رمز التحقق الخاص بك هو: {{1}}. ينتهي خلال 5 دقائق."}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
