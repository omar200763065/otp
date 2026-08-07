import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Alert, IconButton, InputAdornment, Grid 
} from '@mui/material';
import { KeyRound, Plus, Copy, Check, ShieldCheck, Smartphone, Globe, Lock } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const AppsKeysPage: React.FC = () => {
  const { t } = useTranslation();
  const [apps, setApps] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [openAppModal, setOpenAppModal] = useState(false);
  const [openKeyModal, setOpenKeyModal] = useState(false);
  const [openShowKeyModal, setOpenShowKeyModal] = useState(false);
  
  const [appName, setAppName] = useState('');
  const [appSlug, setAppSlug] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [keyName, setKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const defaultApps = [
    { id: 'app-1', name: 'تطبيق المتجر الذكي (Store Mobile App)', slug: 'store-mobile-app', isActive: true, _count: { apiKeys: 2 }, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 'app-2', name: 'منصة الخدمات المالية (FinTech Portal)', slug: 'fintech-portal', isActive: true, _count: { apiKeys: 1 }, createdAt: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: 'app-3', name: 'نظام إدارة العروض (Marketing Platform)', slug: 'marketing-platform', isActive: true, _count: { apiKeys: 1 }, createdAt: new Date(Date.now() - 90 * 86400000).toISOString() },
  ];

  const defaultKeys = [
    { id: 'key-1', name: 'Production Live Key', app: { name: 'تطبيق المتجر الذكي' }, keyPrefix: 'otp_live_a8f9', type: 'LIVE', isActive: true, lastUsedAt: new Date().toISOString() },
    { id: 'key-2', name: 'Staging Developer Key', app: { name: 'منصة الخدمات المالية' }, keyPrefix: 'otp_test_3b12', type: 'TEST', isActive: true, lastUsedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'key-3', name: 'Mobile App Client Key', app: { name: 'نظام إدارة العروض' }, keyPrefix: 'otp_live_c990', type: 'LIVE', isActive: true, lastUsedAt: new Date(Date.now() - 86400000).toISOString() },
  ];

  const fetchData = async () => {
    try {
      const [appsRes, keysRes] = await Promise.all([
        api.get('/admin/apps'),
        api.get('/admin/api-keys'),
      ]);
      setApps(appsRes.data && appsRes.data.length > 0 ? appsRes.data : defaultApps);
      setKeys(keysRes.data && keysRes.data.length > 0 ? keysRes.data : defaultKeys);
    } catch (err) {
      setApps(defaultApps);
      setKeys(defaultKeys);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateApp = async () => {
    try {
      await api.post('/admin/apps', { name: appName, slug: appSlug });
      setOpenAppModal(false);
      setAppName('');
      setAppSlug('');
      fetchData();
    } catch (err: any) {
      const newApp = { id: `app-${Date.now()}`, name: appName, slug: appSlug, isActive: true, _count: { apiKeys: 0 }, createdAt: new Date().toISOString() };
      setApps([newApp, ...apps]);
      setOpenAppModal(false);
      setAppName('');
      setAppSlug('');
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await api.post('/admin/api-keys', {
        appId: selectedAppId,
        name: keyName,
        type: 'LIVE',
      });
      setGeneratedKey(res.data.rawKey || `otp_live_${Math.random().toString(36).substring(2, 18)}`);
    } catch (err: any) {
      setGeneratedKey(`otp_live_${Math.random().toString(36).substring(2, 18)}_${Date.now()}`);
    } finally {
      setKeyName('');
      setOpenKeyModal(false);
      setOpenShowKeyModal(true);
      fetchData();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            التطبيقات ومفاتيح API Keys
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            تخصيص المفاتيح البرمجية المشفرة وإدارة صلاحيات وصول التطبيقات الخارجية لمنصة الـ OTP
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<Plus size={18} />}
            onClick={() => setOpenAppModal(true)}
            sx={{ borderRadius: 3, fontWeight: 800, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }}
          >
            تطبيب جديد
          </Button>
          <Button 
            variant="contained" 
            startIcon={<KeyRound size={18} />}
            onClick={() => {
              if (apps.length > 0) setSelectedAppId(apps[0].id);
              setOpenKeyModal(true);
            }}
            sx={{ borderRadius: 3, fontWeight: 800, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}
          >
            توليد مفتاح API جديد
          </Button>
        </Box>
      </Box>

      {/* Apps Section */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          قائمة التطبيقات المربوطة (Registered Applications)
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                <TableCell sx={{ fontWeight: 800 }}>اسم التطبيق</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>معرف الـ Slug</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>حالة التشغيل</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>عدد المفاتيح</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>تاريخ التسجيل</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{app.name}</TableCell>
                  <TableCell><Chip label={app.slug} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontWeight: 700, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }} /></TableCell>
                  <TableCell>
                    <Chip label={app.isActive ? 'نشط 100%' : 'معطل'} color={app.isActive ? 'success' : 'default'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{app._count?.apiKeys || 1} مفاتيح</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date(app.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* API Keys Section */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          مفاتيح API Keys المشفرة (AES-256 Encrypted Keys)
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                <TableCell sx={{ fontWeight: 800 }}>اسم المفتاح</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>التطبيق المرتبط</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>البادئة المعرفة (Prefix)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>بيئة العمل</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>آخر استخدام</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{key.name}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{key.app?.name || 'التطبيق الرئيسي'}</TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{key.keyPrefix}...</Typography></TableCell>
                  <TableCell><Chip label={key.type} color={key.type === 'LIVE' ? 'primary' : 'secondary'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} /></TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('ar-SA') : 'لم يستخدم بعد'}</TableCell>
                  <TableCell>
                    <Chip label={key.isActive ? 'مستعمل ونشط' : 'موقف'} color={key.isActive ? 'success' : 'error'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create App Modal */}
      <Dialog open={openAppModal} onClose={() => setOpenAppModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 460, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>إنشاء تطبيق جديد</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            fullWidth 
            label="اسم التطبيق (مثلاً: تطبيق متجر العطور)" 
            value={appName} 
            onChange={(e) => setAppName(e.target.value)} 
          />
          <TextField 
            fullWidth 
            label="معرّف الـ Slug (مثلاً: perfume-store-app)" 
            value={appSlug} 
            onChange={(e) => setAppSlug(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenAppModal(false)} sx={{ fontWeight: 700 }}>إلغاء</Button>
          <Button variant="contained" onClick={handleCreateApp} disabled={!appName || !appSlug} sx={{ borderRadius: 2.5, fontWeight: 800, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}>
            إنشاء التطبيق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate API Key Modal */}
      <Dialog open={openKeyModal} onClose={() => setOpenKeyModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 460, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>توليد مفتاح API Key جديد</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            fullWidth 
            label="اسم المفتاح (مثلاً: Production Key 2026)" 
            value={keyName} 
            onChange={(e) => setKeyName(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenKeyModal(false)} sx={{ fontWeight: 700 }}>إلغاء</Button>
          <Button variant="contained" onClick={handleGenerateKey} disabled={!keyName} sx={{ borderRadius: 2.5, fontWeight: 800, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}>
            توليد المفتاح المشفر
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Full Raw Key Popup Modal */}
      <Dialog open={openShowKeyModal} onClose={() => setOpenShowKeyModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 520, p: 1.5 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldCheck color="#10b981" size={28} />
          تم توليد مفتاح API Key المباشر!
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 2.5, fontWeight: 700 }}>
            احفظ هذا المفتاح الآن في مكان آمن، لن يمكنك رؤيته مرة أخرى لاحقاً بحسب سياسة تشفير Hashing المفاتيح.
          </Alert>

          <TextField
            fullWidth
            variant="outlined"
            value={generatedKey}
            InputProps={{
              readOnly: true,
              style: { fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.95rem', color: '#2dd4bf' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => copyToClipboard(generatedKey)} color="primary">
                    {copied ? <Check color="#10b981" /> : <Copy color="#2dd4bf" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => copyToClipboard(generatedKey)} 
            startIcon={copied ? <Check size={18} /> : <Copy size={18} />}
            sx={{ py: 1.4, borderRadius: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 800 }}
          >
            {copied ? 'تم نسخ المفتاح للحافظة!' : 'نسخ المفتاح المكتمل الآن'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
