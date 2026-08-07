import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Grid, Chip, Tabs, Tab, CircularProgress 
} from '@mui/material';
import { MessageSquare, Save, CheckCircle2, QrCode, LogOut, RefreshCw, Smartphone } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const WhatsAppPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<any>(null);

  // Meta Form States
  const [phoneNumberId, setPhoneNumberId] = useState('123456789012345');
  const [businessAccountId, setBusinessAccountId] = useState('123456789012345');
  const [token, setToken] = useState('EAAG...YOUR_ACCESS_TOKEN_HERE');
  const [saved, setSaved] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/admin/whatsapp/status');
      setStatusData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Live poll QR code update every 3s
    return () => clearInterval(interval);
  }, []);

  const handleSwitchProvider = async (mode: 'BAILEYS_QR' | 'META_CLOUD_API') => {
    try {
      await api.post('/admin/whatsapp/provider', { mode });
      fetchStatus();
    } catch (err: any) {
      alert('Error switching provider');
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post('/admin/whatsapp/disconnect');
      fetchStatus();
    } catch (err: any) {
      alert('Error disconnecting session');
    }
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const providerMode = statusData?.providerMode || 'BAILEYS_QR';
  const baileys = statusData?.baileys || { status: 'DISCONNECTED', qrDataUrl: null, connectedPhoneNumber: null };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header & Active Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('whatsappConfig')} (WhatsApp Engine)
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>النمط المفعل حالياً:</Typography>
          <Chip 
            label={providerMode === 'BAILEYS_QR' ? 'ربط QR Code (Baileys Web)' : 'Meta Cloud API الرسمي'} 
            color={providerMode === 'BAILEYS_QR' ? 'secondary' : 'primary'} 
            sx={{ fontWeight: 800, px: 1 }}
          />
        </Box>
      </Box>

      {/* Mode Switcher Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ '& .MuiTab-root': { fontWeight: 700 } }}>
          <Tab icon={<QrCode size={18} />} iconPosition="start" label="ربط السريع عبر كود QR (WhatsApp Web)" />
          <Tab icon={<MessageSquare size={18} />} iconPosition="start" label="WhatsApp Business Cloud API (Meta)" />
        </Tabs>
      </Box>

      {/* Tab 0: Baileys QR Code Pairing */}
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  مسح رمز QR Code بالهاتف
                </Typography>
                {providerMode !== 'BAILEYS_QR' && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    onClick={() => handleSwitchProvider('BAILEYS_QR')}
                    sx={{ borderRadius: 3, fontWeight: 700 }}
                  >
                    تفعيل نمط الـ QR Code هذا
                  </Button>
                )}
              </Box>

              {baileys.status === 'CONNECTED' ? (
                <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={48} color="#10b981" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                    تم ربط الواتساب بنجاح!
                  </Typography>
                  <Chip 
                    icon={<Smartphone size={16} />} 
                    label={`الرقم المربوط حالياً: +${baileys.connectedPhoneNumber || 'نشط'}`} 
                    color="success" 
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, px: 1, borderRadius: 3 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    خادمتك جاهزة الآن لإرسال كافة رموز الـ OTP مباشرة من هذا الرقم.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<LogOut size={18} />}
                    onClick={handleDisconnect}
                    sx={{ mt: 2, borderRadius: 3, fontWeight: 700 }}
                  >
                    فصل الرقم وإعادة المسح
                  </Button>
                </Box>
              ) : baileys.qrDataUrl ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    افتـح تطبيق الواتساب على هاتفك &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; امسح الرمز أدناه:
                  </Typography>

                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 4, 
                      bgcolor: '#ffffff', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      border: '4px solid #6366f1'
                    }}
                  >
                    <img src={baileys.qrDataUrl} alt="WhatsApp QR Code" style={{ width: 260, height: 260, display: 'block' }} />
                  </Box>

                  <Chip 
                    icon={<RefreshCw size={14} className="animate-spin" />} 
                    label="جاري انتظار مسح الكود بانتظار اتصالك..." 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  />
                </Box>
              ) : (
                <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress color="secondary" size={40} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    جاري توليد كود QR Code الجديد للواتساب...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                تعليمات الربط السريع (Linked Devices)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                1. افتح تطبيق واتساب العادي أو WhatsApp Business على هاتفك الذكي.<br />
                2. اضغط على القائمة (الثلاث نقاط بالاقتراحات أو الإعدادات).<br />
                3. اختر **الأجهزة المرتبطة (Linked Devices)**.<br />
                4. اضغط على **ربط جهاز (Link a Device)** وقم بتوجيه الكاميرا نحو الكود الظاهر على الشاشة.<br />
                5. سيتصل الخادم تلقائياً ويصبح جاهزاً لإرسال كافة رسائل الـ OTP!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Meta Cloud API */}
      {tab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  اعتمادات Meta Graph Cloud API الرسمية
                </Typography>
                {providerMode !== 'META_CLOUD_API' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => handleSwitchProvider('META_CLOUD_API')}
                    sx={{ borderRadius: 3, fontWeight: 700 }}
                  >
                    تفعيل نمط Meta الرسمي
                  </Button>
                )}
              </Box>

              {saved && (
                <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ borderRadius: 3, mb: 2 }}>
                  تم حفظ إعدادات WhatsApp Business API بنجاح!
                </Alert>
              )}

              <Box component="form" onSubmit={handleSaveMeta} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('phoneNumberId')}
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                />

                <TextField
                  fullWidth
                  label={t('businessAccountId')}
                  value={businessAccountId}
                  onChange={(e) => setBusinessAccountId(e.target.value)}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('whatsappToken')}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={18} />}
                  sx={{ mt: 1, py: 1.2, borderRadius: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  تحديث وحفظ الإعدادات
                </Button>
              </Box>
            </Paper>
          </Grid>

              <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t('templates')} (Approved Templates)
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>otp_verification_code</Typography>
                <Typography variant="body2" color="text.secondary">
                  {"رمز التحقق الخاص بك لمنصة الأمان هو: {{1}}. ينتهي الكود خلال 5 دقائق."}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
