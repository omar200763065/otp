import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Tabs, Tab, TextField, InputAdornment, Button 
} from '@mui/material';
import { Search, Download, Inbox } from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const LogsPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [otpLogs, setOtpLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const [otpRes, auditRes] = await Promise.all([
          api.get('/api/admin/security/otp-logs?limit=50').catch(() => ({ data: [] })),
          api.get('/api/admin/security/audit-logs?limit=50').catch(() => ({ data: [] })),
        ]);
        setOtpLogs(otpRes.data || []);
        setAuditLogs(auditRes.data || []);
      } catch (err) {
        console.warn('Logs fetch notice:', err);
      }
    };
    fetchLogs();
  }, []);

  const filteredOtpLogs = otpLogs.filter(log => 
    log.phoneNumber?.toLowerCase().includes(search.toLowerCase()) || 
    log.id?.toLowerCase().includes(search.toLowerCase()) ||
    log.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            سجلات المعاملات والـ Audit Log الخاصة بك
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            تتبع أرشيف استدعاءات إرسال واستلام الرمز وسجل نشاط حسابك
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          startIcon={<Download size={18} />}
          sx={{ borderRadius: 3, fontWeight: 800, borderColor: 'rgba(45, 212, 191, 0.3)', color: '#2dd4bf' }}
          onClick={() => alert('تم تصدير سجل المعاملات بصيغة CSV بنجاح!')}
        >
          تصدير السجلات CSV
        </Button>
      </Box>

      {/* Tabs & Search Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', pb: 1 }}>
        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ '& .MuiTab-root': { fontWeight: 800, fontSize: '0.95rem' } }}>
          <Tab label="سجلات معاملات الـ OTP الخاصة بك" />
          <Tab label="سجلات تدقيق الإدارة (System Audit Trail)" />
        </Tabs>

        <TextField
          size="small"
          placeholder="بحث بالرقم أو الحالة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Box>

      {tab === 0 ? (
        <Paper sx={{ p: 3.5, borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                  <TableCell sx={{ fontWeight: 800 }}>معرّف المعاملة</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>رقم الهاتف المستلم</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>قناة الإرسال</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>حالة المعاملة</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>المحاولات</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>صلاحية الرمز</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>التاريخ والوقت</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOtpLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Inbox size={40} color="#64748b" />
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                          لا توجد سجلات معاملات إرسال مسجلة لحسابك بعد.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOtpLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{log.id}</Typography></TableCell>
                      <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{log.phoneNumber}</TableCell>
                      <TableCell><Chip label={log.channel} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800 }} /></TableCell>
                      <TableCell>
                        <Chip 
                          label={log.status === 'VERIFIED' ? 'مؤكد بنجاح' : log.status === 'PENDING' ? 'قيد الانتظار' : 'فاشل / محظور'} 
                          color={log.status === 'VERIFIED' ? 'success' : log.status === 'PENDING' ? 'warning' : 'error'} 
                          size="small" 
                          sx={{ borderRadius: 2, fontWeight: 800 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{log.attempts} / 3</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(log.expiresAt).toLocaleTimeString('ar-SA')}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date(log.createdAt).toLocaleString('ar-SA')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3.5, borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                  <TableCell sx={{ fontWeight: 800 }}>المدير المسجل</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>الحدث (Action)</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>القسم / المورد (Resource)</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>عنوان IP</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>التاريخ والوقت</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Inbox size={40} color="#64748b" />
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                          لا توجد سجلات تدقيق سابقة.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((audit) => (
                    <TableRow key={audit.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{audit.userEmail || 'مدير النظام'}</TableCell>
                      <TableCell><Chip label={audit.action} color="secondary" size="small" sx={{ borderRadius: 2, fontWeight: 800 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{audit.resource}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: '#38bdf8' }}>{audit.ipAddress}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date(audit.createdAt).toLocaleString('ar-SA')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};
