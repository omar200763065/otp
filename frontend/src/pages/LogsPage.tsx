import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tabs, Tab } from '@mui/material';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const LogsPage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [otpLogs, setOtpLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const [otpRes, auditRes] = await Promise.all([
          api.get('/api/v1/logs?limit=50').catch(() => ({ data: [] })),
          api.get('/admin/security/audit-logs?limit=50').catch(() => ({ data: [] })),
        ]);
        setOtpLogs(otpRes.data || []);
        setAuditLogs(auditRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {t('logsAndAudit')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ '& .MuiTab-root': { fontWeight: 700 } }}>
          <Tab label="سجلات معاملات الـ OTP (OTP Transactions)" />
          <Tab label="سجلات تدقيق الإدارة (System Audit Trail)" />
        </Tabs>
      </Box>

      {tab === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>معرّف المعاملة</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('phoneNumber')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('channel')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('status')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('attempts')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>تاريخ الصلاحية</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('createdAt')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otpLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{log.id.slice(0, 8)}...</Typography></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.phoneNumber}</TableCell>
                    <TableCell><Chip label={log.channel} size="small" variant="outlined" /></TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status} 
                        color={log.status === 'VERIFIED' ? 'success' : log.status === 'PENDING' ? 'warning' : 'error'} 
                        size="small" 
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{log.attempts}</TableCell>
                    <TableCell>{new Date(log.expiresAt).toLocaleTimeString('ar-SA')}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>المستخدم</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>الحدث (Action)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>المورد (Resource)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>عنوان IP</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>التاريخ والوقت</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((audit) => (
                  <TableRow key={audit.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{audit.userEmail || 'System Admin'}</TableCell>
                    <TableCell><Chip label={audit.action} color="primary" size="small" sx={{ borderRadius: 2 }} /></TableCell>
                    <TableCell>{audit.resource}</TableCell>
                    <TableCell>{audit.ipAddress || '127.0.0.1'}</TableCell>
                    <TableCell>{new Date(audit.createdAt).toLocaleString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};
