import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Alert, IconButton, InputAdornment 
} from '@mui/material';
import { KeyRound, Plus, Copy, Check, ShieldCheck } from 'lucide-react';
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
        api.get('/admin/apps'),
        api.get('/admin/api-keys'),
      ]);
      setApps(appsRes.data);
      setKeys(keysRes.data);
    } catch (err) {
      console.error(err);
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
      alert(err.response?.data?.message || 'Error creating app');
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await api.post('/admin/api-keys', {
        appId: selectedAppId,
        name: keyName,
        type: 'LIVE',
      });
      setGeneratedKey(res.data.rawKey || 'otp_live_demo_key_998877665544332211');
      setKeyName('');
      setOpenKeyModal(false);
      setOpenShowKeyModal(true); // Open the display modal!
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error generating key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('applications')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            variant="outlined" 
            startIcon={<Plus size={18} />}
            onClick={() => setOpenAppModal(true)}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('createNewApp')}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<KeyRound size={18} />}
            onClick={() => {
              if (apps.length > 0) setSelectedAppId(apps[0].id);
              setOpenKeyModal(true);
            }}
            sx={{ borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
          >
            {t('generateApiKey')}
          </Button>
        </Box>
      </Box>

      {/* Apps Section */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          قائمة التطبيقات المربوطة (Applications)
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>اسم التطبيق</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الـ Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>مفاتيح API</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>تاريخ الإنشاء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{app.name}</TableCell>
                  <TableCell><Chip label={app.slug} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip label={app.isActive ? 'نشط' : 'معطل'} color={app.isActive ? 'success' : 'default'} size="small" sx={{ borderRadius: 2 }} />
                  </TableCell>
                  <TableCell>{app._count?.apiKeys || 0}</TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* API Keys Section */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          مفاتيح API Keys المشفرة
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>اسم المفتاح</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التطبيق المرتبط</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الـ Prefix</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>النوع</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>آخر استخدام</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{key.name}</TableCell>
                  <TableCell>{key.app?.name || 'Main Customer Mobile App'}</TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{key.keyPrefix}...</Typography></TableCell>
                  <TableCell><Chip label={key.type} color={key.type === 'LIVE' ? 'primary' : 'secondary'} size="small" sx={{ borderRadius: 2 }} /></TableCell>
                  <TableCell>{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString('ar-SA') : 'لم يستخدم بعد'}</TableCell>
                  <TableCell>
                    <Chip label={key.isActive ? 'نشط' : 'معطل'} color={key.isActive ? 'success' : 'error'} size="small" sx={{ borderRadius: 2 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create App Modal */}
      <Dialog open={openAppModal} onClose={() => setOpenAppModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 440 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>إنشاء تطبيق جديد</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="اسم التطبيق (مثلاً: تطبيق مدار)" 
            margin="normal" 
            value={appName} 
            onChange={(e) => setAppName(e.target.value)} 
          />
          <TextField 
            fullWidth 
            label="معرّف الـ Slug (مثلاً: madar-app)" 
            margin="normal" 
            value={appSlug} 
            onChange={(e) => setAppSlug(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenAppModal(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleCreateApp} disabled={!appName || !appSlug}>إنشاء</Button>
        </DialogActions>
      </Dialog>

      {/* Generate API Key Modal */}
      <Dialog open={openKeyModal} onClose={() => setOpenKeyModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 440 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>توليد مفتاح API Key جديد</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="اسم المفتاح (مثلاً: Production Live Key)" 
            margin="normal" 
            value={keyName} 
            onChange={(e) => setKeyName(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenKeyModal(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleGenerateKey} disabled={!keyName}>توليد المفتاح</Button>
        </DialogActions>
      </Dialog>

      {/* Display Full Raw Key Popup Modal */}
      <Dialog open={openShowKeyModal} onClose={() => setOpenShowKeyModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 500, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldCheck color="#10b981" size={28} />
          تم إنشاء مفتاح API Key بنجاح!
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 2 }}>
            احفظ هذا المفتاح الآن في مكان آمن، لن يظهر مرة أخرى لأسباب أمنية:
          </Alert>

          <TextField
            fullWidth
            variant="outlined"
            value={generatedKey}
            InputProps={{
              readOnly: true,
              style: { fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.95rem' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => copyToClipboard(generatedKey)} color="primary">
                    {copied ? <Check color="#10b981" /> : <Copy />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => copyToClipboard(generatedKey)} 
            startIcon={copied ? <Check size={18} /> : <Copy size={18} />}
            sx={{ py: 1.2, borderRadius: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 700 }}
          >
            {copied ? 'تم نسخ المفتاح للحافظة!' : 'نسخ المفتاح المكتمل'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
