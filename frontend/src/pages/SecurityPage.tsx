import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const SecurityPage: React.FC = () => {
  const { t } = useTranslation();
  const [rules, setRules] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState<'BLACKLIST' | 'WHITELIST'>('BLACKLIST');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');

  const fetchRules = async () => {
    try {
      const res = await api.get('/admin/security/rules');
      setRules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async () => {
    try {
      await api.post('/admin/security/rules', { type, value, reason });
      setOpenModal(false);
      setValue('');
      setReason('');
      fetchRules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating security rule');
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await api.delete(`/admin/security/rules/${id}`);
      fetchRules();
    } catch (err: any) {
      alert('Error deleting rule');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('securityCenter')} (Security Rules & Rate Limiting)
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => setOpenModal(true)}
          sx={{ borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
        >
          {t('addSecurityRule')}
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          قواعد القائمة السوداء والقائمة البيضاء النشطة
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>النوع (Type)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('ipOrPhone')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('reason')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('createdAt')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} hover>
                  <TableCell>
                    <Chip 
                      label={rule.type} 
                      color={rule.type === 'BLACKLIST' ? 'error' : 'success'} 
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{rule.value}</TableCell>
                  <TableCell>{rule.reason || 'بدون مبرر مدون'}</TableCell>
                  <TableCell>{new Date(rule.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>
                    <Button color="error" size="small" onClick={() => handleDeleteRule(rule.id)} startIcon={<Trash2 size={16} />}>
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Rule Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { borderRadius: 4, width: 440 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>إضافة قاعدة أمان جديدة</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>نوع القاعدة</InputLabel>
            <Select value={type} label="نوع القاعدة" onChange={(e) => setType(e.target.value as any)}>
              <MenuItem value="BLACKLIST">قائمة سوداء (BLACKLIST - حظر)</MenuItem>
              <MenuItem value="WHITELIST">قائمة بيضاء (WHITELIST - سماح)</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            fullWidth 
            label="عنوان IP أو CIDR أو بادئة الدولة (+966)" 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
          />

          <TextField 
            fullWidth 
            label="سبب الحظر / السماح" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenModal(false)}>إلغاء</Button>
          <Button variant="contained" color="error" onClick={handleCreateRule} disabled={!value}>حفظ القاعدة</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
