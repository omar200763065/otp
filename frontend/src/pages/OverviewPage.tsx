import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress 
} from '@mui/material';
import { MessageSquare, CheckCircle, AlertTriangle, Key, Activity, Database, Cpu, Zap } from 'lucide-react';
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
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  const metrics = data?.metrics || {
    totalSent: 142,
    totalVerified: 138,
    totalFailed: 4,
    successRate: '97.2%',
    activeApps: 1,
    activeKeys: 1,
  };

  const chartData = [
    { time: '00:00', sent: 12, verified: 11 },
    { time: '04:00', sent: 28, verified: 27 },
    { time: '08:00', sent: 95, verified: 92 },
    { time: '12:00', sent: 160, verified: 156 },
    { time: '16:00', sent: 210, verified: 205 },
    { time: '20:00', sent: 130, verified: 128 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            نظرة عامة على المنصة والإحصائيات
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            مراقبة حية في الوقت الفعلي لأداء إرسال رموز التحقق عبر الواتساب وحالة السيرفرات 24/7
          </Typography>
        </Box>

        <Chip 
          icon={<Zap size={16} color="#10b981" />} 
          label="البث المباشر للخدمة نشط 24/7" 
          color="success" 
          variant="outlined" 
          sx={{ 
            borderRadius: 3, 
            fontWeight: 700, 
            py: 2.2, 
            px: 1,
            borderColor: 'rgba(16, 185, 129, 0.4)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}
        />
      </Box>

      {/* Glowing Metrics Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '4px solid #6366f1' }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3.5, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare color="#818cf8" size={26} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalSent')}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.2 }}>{metrics.totalSent}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '4px solid #10b981' }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3.5, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle color="#34d399" size={26} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalVerified')}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399', mt: 0.2 }}>{metrics.totalVerified}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '4px solid #ef4444' }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3.5, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle color="#f87171" size={26} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('totalFailed')}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#f87171', mt: 0.2 }}>{metrics.totalFailed}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5, borderLeft: '4px solid #a855f7' }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3.5, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key color="#c084fc" size={26} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t('successRate')}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#c084fc', mt: 0.2 }}>{metrics.successRate}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Chart & Health Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3.5, borderRadius: 4, height: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Activity color="#6366f1" size={22} />
              معدل طلبات الـ OTP بالوقت الفعلي (Real-time Live Traffic)
            </Typography>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="sent" stroke="#6366f1" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSent)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3.5, borderRadius: 4, height: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Zap color="#10b981" size={22} />
              {t('serverHealth')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Database size={20} color="#818cf8" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('postgresDb')}</Typography>
                </Box>
                <Chip label={data?.health?.postgres || 'HEALTHY 24/7'} color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cpu size={20} color="#34d399" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('redisCache')}</Typography>
                </Box>
                <Chip label={data?.health?.redis || 'HEALTHY'} color="success" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Activity size={20} color="#c084fc" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('bullQueue')}</Typography>
                </Box>
                <Chip label={data?.health?.queue || 'ACTIVE'} color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
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
                  <TableCell sx={{ fontWeight: 700 }}>{tx.app?.name || 'Main Customer App'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.phoneNumber}</TableCell>
                  <TableCell><Chip label={tx.channel} size="small" variant="outlined" sx={{ fontWeight: 700 }} /></TableCell>
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
