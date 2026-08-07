import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Switch, FormControlLabel, CircularProgress, Grid 
} from '@mui/material';
import { Webhook, Plus, Save, ShieldCheck, CheckCircle2, Zap, Send, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WebhooksPage: React.FC = () => {
  const { t } = useTranslation();
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourstore.com/v1/webhooks/otp-events');
  const [secret, setSecret] = useState('whsec_prod_998877665544332211');
  const [saved, setSaved] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh_1',
      url: 'https://api.yourstore.com/v1/webhooks/otp-events',
      events: ['otp.sent', 'otp.verified', 'security.alert'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'wh_2',
      url: 'https://fintech.app/callbacks/otp',
      events: ['otp.verified', 'otp.failed'],
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestPing = async () => {
    setTestingPing(true);
    setPingSuccess(null);
    await new Promise(r => setTimeout(r, 1200));
    setTestingPing(false);
    setPingSuccess('تم إرسال إشعار Ping تجريبي بنجاح إلى الرابط! استجابة الخادم: HTTP 200 OK');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            الـ Webhooks وإشعارات الأحداث الفورية
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            استقبال التنبيهات المباشرة فور إرسال أو نجاح تأكيد أو فشل رمز الـ OTP على خادمج الخاص
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          startIcon={testingPing ? <CircularProgress size={16} color="inherit" /> : <Zap size={18} color="#2dd4bf" />}
          onClick={handleTestPing}
          disabled={testingPing}
          sx={{ borderRadius: 3, fontWeight: 800, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }}
        >
          {testingPing ? 'جاري الفحص...' : 'اختبار اتصال Ping بالـ Webhook'}
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ borderRadius: 3, fontWeight: 800 }}>
          تم حفظ وتأمين إعدادات الـ Webhook بنجاح!
        </Alert>
      )}

      {pingSuccess && (
        <Alert severity="success" icon={<Zap size={20} color="#10b981" />} sx={{ borderRadius: 3, fontWeight: 800 }}>
          {pingSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3.5, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Webhook color="#2dd4bf" size={22} />
              إضافة رابط Webhook جديد للتنبيهات
            </Typography>

            <Box component="form" onSubmit={handleSaveWebhook} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="رابط الـ Webhook المستلم (Endpoint URL)"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                helperText="الرابط الذي سيستقبل الـ HTTP POST payload الفوري عند كل حدث"
              />

              <TextField
                fullWidth
                label="مفتاح التوقيع المشفر (HMAC-SHA256 Secret Signature)"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                helperText="يُرسل في الهيدر X-OTP-Signature لتأمين صحة مصدر الإشعار ومنع الانتحال"
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<Typography variant="body2" sx={{ fontWeight: 700 }}>إشعار otp.sent</Typography>} />
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<Typography variant="body2" sx={{ fontWeight: 700 }}>إشعار otp.verified</Typography>} />
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<Typography variant="body2" sx={{ fontWeight: 700 }}>تنبيه security.alert</Typography>} />
              </Box>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save size={18} />}
                sx={{ mt: 1, py: 1.4, px: 3, borderRadius: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)', fontWeight: 800 }}
              >
                حفظ وحظر التلاعب بالرسائل
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3.5, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Code color="#38bdf8" size={20} />
              معاينة الحمولة الممررة (Webhook Payload Sample)
            </Typography>

            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#080c14', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
              <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#34d399', margin: 0, whiteSpace: 'pre-wrap' }}>
{`{
  "event": "otp.verified",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "phoneNumber": "+966501234567",
    "channel": "WHATSAPP",
    "status": "SUCCESS",
    "attempts": 1,
    "latencyMs": 1150
  },
  "signature": "sha256=a8f9c2d1..."
}`}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>

      {/* Webhook Endpoints List */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          الـ Webhooks الفعالة حالياً على الخادم
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                <TableCell sx={{ fontWeight: 800 }}>رابط المستلم (Endpoint URL)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>الأحداث المفعلة (Events)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>حالة الاتصال</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>تاريخ الإنشاء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webhooks.map((wh) => (
                <TableRow key={wh.id} hover>
                  <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{wh.url}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                      {wh.events.map((ev) => (
                        <Chip key={ev} label={ev} size="small" color="primary" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 800 }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={wh.isActive ? 'مباشر 24/7' : 'موقف'} color={wh.isActive ? 'success' : 'default'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date(wh.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
