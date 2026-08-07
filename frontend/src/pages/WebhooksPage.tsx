import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Switch, FormControlLabel 
} from '@mui/material';
import { Webhook, Plus, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WebhooksPage: React.FC = () => {
  const { t } = useTranslation();
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/webhooks/otp');
  const [secret, setSecret] = useState('whsec_super_secret_signature_key_2026');
  const [saved, setSaved] = useState(false);

  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh_1',
      url: 'https://api.yourdomain.com/webhooks/otp',
      events: ['otp.sent', 'otp.verified', 'otp.failed'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        إدارة الـ Webhooks وإشعارات الأحداث الفورية
      </Typography>

      {saved && (
        <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ borderRadius: 3 }}>
          تم حفظ إعدادات الـ Webhook بنجاح!
        </Alert>
      )}

      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Webhook color="#6366f1" size={22} />
          إضافة رابط Webhook لإشعارات النظام
        </Typography>

        <Box component="form" onSubmit={handleSaveWebhook} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="رابط الـ Webhook (Endpoint URL)"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            helperText="الرابط الذي سيستقبل الإشعارات الفورية عند إرسال أو تأكيد أو فشل الـ OTP"
          />

          <TextField
            fullWidth
            label="مفتاح التوقيع المشفر (HMAC Secret Signature)"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            helperText="يُستخدم في هيدر X-OTP-Signature للتحقق من أصل الإشعار ومنع التلاعب"
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="تأكيد الحدث otp.sent (عند الإرسال)" />
            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="تأكيد الحدث otp.verified (عند نجاح التحقق)" />
          </Box>

          <Button
            type="submit"
            variant="contained"
            startIcon={<Save size={18} />}
            sx={{ mt: 1, py: 1.2, borderRadius: 3, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontWeight: 700 }}
          >
            حفظ الـ Webhook
          </Button>
        </Box>
      </Paper>

      {/* Webhook Endpoints List */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          الـ Webhooks الفعالة حالياً
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>رابط الـ Webhook</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الأحداث (Events)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>تاريخ الإنشـاء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webhooks.map((wh) => (
                <TableRow key={wh.id} hover>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{wh.url}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {wh.events.map((ev) => (
                        <Chip key={ev} label={ev} size="small" color="secondary" sx={{ borderRadius: 2, fontWeight: 700 }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={wh.isActive ? 'نشط 24/7' : 'معطل'} color={wh.isActive ? 'success' : 'default'} size="small" sx={{ borderRadius: 2 }} />
                  </TableCell>
                  <TableCell>{new Date(wh.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
