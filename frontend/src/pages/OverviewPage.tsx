import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress 
} from '@mui/material';
import { MessageSquare, CheckCircle, AlertTriangle, Key, Activity, Database, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard/overview');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Live refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  const metrics = data?.metrics || {
    totalSent: 0,
    totalVerified: 0,
    totalFailed: 0,
    successRate: '100%',
    activeApps: 0,
    activeKeys: 0,
  };

  const chartData = [
    { time: '00:00', sent: 12, verified: 11 },
    { time: '04:00', sent: 25, verified: 24 },
    { time: '08:00', sent: 85, verified: 82 },
    { time: '12:00', sent: 140, verified: 136 },
    { time: '16:00', sent: 190, verified: 185 },
    { time: '20:00', sent: 110, verified: 108 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('dashboard')}
        </Typography>
        <Chip 
          icon={<Activity size={16} color="#10b981" />} 
          label="البث المباشر للخدمة نشط" 
          color="success" 
          variant="outlined" 
          sx={{ borderRadius: 3, fontWeight: 700 }}
        />
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare color="#6366f1" size={24} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalSent')}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{metrics.totalSent}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle color="#10b981" size={24} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalVerified')}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>{metrics.totalVerified}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle color="#ef4444" size={24} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalFailed')}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444' }}>{metrics.totalFailed}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key color="#a855f7" size={24} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('successRate')}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#a855f7' }}>{metrics.successRate}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Chart & Health Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              معدل طلبات الـ OTP بالوقت الفعلي (Traffic Volume)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 12, border: 'none' }} />
                <Area type="monotone" dataKey="sent" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, height: 360, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t('serverHealth')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Database size={20} color="#6366f1" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('postgresDb')}</Typography>
                </Box>
                <Chip label={data?.health?.postgres || 'HEALTHY'} color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cpu size={20} color="#10b981" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('redisCache')}</Typography>
                </Box>
                <Chip label={data?.health?.redis || 'HEALTHY'} color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Activity size={20} color="#a855f7" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('bullQueue')}</Typography>
                </Box>
                <Chip label={data?.health?.queue || 'ACTIVE'} color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {t('recentActivity')}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>التطبيق</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('phoneNumber')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('channel')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('status')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('attempts')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('createdAt')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.recentTransactions?.map((tx: any) => (
                <TableRow key={tx.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{tx.app?.name || 'Main Customer App'}</TableCell>
                  <TableCell>{tx.phoneNumber}</TableCell>
                  <TableCell><Chip label={tx.channel} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip 
                      label={tx.status} 
                      color={tx.status === 'VERIFIED' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'error'} 
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell>{tx.attempts} / {tx.maxAttempts || 3}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
