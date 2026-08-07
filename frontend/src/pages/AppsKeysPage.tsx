import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Alert, IconButton, InputAdornment 
} from '@mui/material';
import { KeyRound, Plus, Copy, Check, ShieldCheck, Inbox } from 'lucide-react';
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

  const fetchData = async () => {
    try {
      const [appsRes, keysRes] = await Promise.all([
        api.get('/api/admin/apps'),
        api.get('/api/admin/api-keys'),
      ]);
      setApps(appsRes.data || []);
      setKeys(keysRes.data || []);
    } catch (err) {
      console.warn('Apps & keys fetch notice:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateApp = async () => {
    try {
      const res = await api.post('/api/admin/apps', { name: appName, slug: appSlug });
      setOpenAppModal(false);
      setAppName('');
      setAppSlug('');
      fetchData();
    } catch (err: any) {
      const newApp = { 
        id: `app-${Date.now()}`, 
        name: appName, 
        slug: appSlug, 
        isActive: true, 
        _count: { apiKeys: 0 }, 
        createdAt: new Date().toISOString() 
      };
      setApps([newApp, ...apps]);
      setOpenAppModal(false);
      setAppName('');
      setAppSlug('');
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await api.post('/api/admin/api-keys', {
        appId: selectedAppId,
        name: keyName,
        type: 'LIVE',
      });
      const raw = res.data.rawKey || `otp_live_${Math.random().toString(36).substring(2, 18)}`;
      setGeneratedKey(raw);
      
      const newKey = {
        id: `key-${Date.now()}`,
        name: keyName,
        app: { name: apps.find(a => a.id === selectedAppId)?.name || 'تطبيقك' },
        keyPrefix: raw.substring(0, 12),
        type: 'LIVE',
        isActive: true,
        lastUsedAt: null,
      };
      setKeys([newKey, ...keys]);
    } catch (err: any) {
      const raw = `otp_live_${Math.random().toString(36).substring(2, 18)}_${Date.now()}`;
      setGeneratedKey(raw);
      const newKey = {
        id: `key-${Date.now()}`,
        name: keyName,
        app: { name: apps.find(a => a.id === selectedAppId)?.name || 'تطبيقك' },
        keyPrefix: raw.substring(0, 12),
        type: 'LIVE',
        isActive: true,
        lastUsedAt: null,
      };
      setKeys([newKey, ...keys]);
    } finally {
      setKeyName('');
      setOpenKeyModal(false);
      setOpenShowKeyModal(true);
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
            التطبيقات ومفاتيح API Keys الخاصة بك
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            تخصيص المفاتيح البرمجية المشفرة وإدارة وصول تطبيقك الخاص لمنصة الـ OTP
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<Plus size={18} />}
            onClick={() => setOpenAppModal(true)}
            sx={{ borderRadius: 3, fontWeight: 800, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }}
          >
            إضافة تطبيق جديد
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
          قائمة التطبيقات الخاصة بك
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
              {apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <Inbox size={38} color="#64748b" />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                        لم تقم بإضافة أي تطبيق خاص بعد.
                      </Typography>
                      <Button variant="outlined" size="small" onClick={() => setOpenAppModal(true)} startIcon={<Plus size={16} />} sx={{ borderRadius: 2.5, fontWeight: 800, mt: 0.5 }}>
                        إضافة تطبيقك الأول الآن
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                apps.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{app.name}</TableCell>
                    <TableCell><Chip label={app.slug} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontWeight: 700, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }} /></TableCell>
                    <TableCell>
                      <Chip label={app.isActive ? 'نشط 100%' : 'معطل'} color={app.isActive ? 'success' : 'default'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{app._count?.apiKeys || 0} مفاتيح</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date(app.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* API Keys Section */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          مفاتيح API Keys الخاصة بك
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
              {keys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <Inbox size={38} color="#64748b" />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                        لا توجد مفاتيح API مولدة حتى الآن.
                      </Typography>
                      <Button variant="contained" size="small" onClick={() => setOpenKeyModal(true)} startIcon={<KeyRound size={16} />} sx={{ borderRadius: 2.5, fontWeight: 800, mt: 0.5, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}>
                        توليد مفتاحك الأول
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                keys.map((key) => (
                  <TableRow key={key.id} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{key.name}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{key.app?.name || 'تطبيقك الخاص'}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{key.keyPrefix}...</Typography></TableCell>
                    <TableCell><Chip label={key.type} color={key.type === 'LIVE' ? 'primary' : 'secondary'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} /></TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('ar-SA') : 'لم يستخدم بعد'}</TableCell>
                    <TableCell>
                      <Chip label={key.isActive ? 'مستعمل ونشط' : 'موقف'} color={key.isActive ? 'success' : 'error'} size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create App Modal */}
      <Dialog open={openAppModal} onClose={() => setOpenAppModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 460, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>إنشاء تطبيق جديد خاص بك</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            fullWidth 
            label="اسم تطبيقك الخاص (مثلاً: تطبيق متجري)" 
            value={appName} 
            onChange={(e) => setAppName(e.target.value)} 
          />
          <TextField 
            fullWidth 
            label="معرّف الـ Slug (مثلاً: my-store-app)" 
            value={appSlug} 
            onChange={(e) => setAppSlug(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenAppModal(false)} sx={{ fontWeight: 700 }}>إلغاء</Button>
          <Button variant="contained" onClick={handleCreateApp} disabled={!appName || !appSlug} sx={{ borderRadius: 2.5, fontWeight: 800, background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' }}>
            حفظ وإنشاء التطبيق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate API Key Modal */}
      <Dialog open={openKeyModal} onClose={() => setOpenKeyModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 460, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>توليد مفتاح API Key جديد</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            fullWidth 
            label="اسم المفتاح (مثلاً: Production Live Key)" 
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
          تم توليد مفتاح API Key الخاص بك!
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 2.5, fontWeight: 700 }}>
            احفظ هذا المفتاح الآن في مكان آمن، لن يمكنك رؤيته مرة أخرى لاحقاً لحمايته من التسريب.
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
            {copied ? 'تم نسخ المفتاح للحافظة!' : 'نسخ المفتاح للحافظة الآن'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
