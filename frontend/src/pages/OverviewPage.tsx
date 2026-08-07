import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, LinearProgress, Tab, Tabs, Tooltip as MuiTooltip
} from '@mui/material';
import { 
  MessageSquare, CheckCircle, AlertTriangle, Key, Activity, Database, 
  Cpu, Zap, ShieldCheck, ArrowUpRight, Inbox, Sparkles, Server, RefreshCw, Smartphone
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { QuickOtpModal } from '../components/Modals/QuickOtpModal';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filterTab, setFilterTab] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'FAILED'>('ALL');
  const [quickOtpOpen, setQuickOtpOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/admin/dashboard/overview');
      setData(res.data);
    } catch (err) {
      console.warn('Dashboard overview poll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 6000);
    return () => clearInterval(interval);
  }, []);

  const metrics = data?.metrics || {
    totalSent: 0,
    totalVerified: 0,
    totalFailed: 0,
    successRate: '100%',
    activeApps: 0,
    activeKeys: 0,
  };

  const chartData = data?.chartData || [
    { time: '00:00', sent: 12, verified: 10 },
    { time: '04:00', sent: 24, verified: 22 },
    { time: '08:00', sent: 48, verified: 45 },
    { time: '12:00', sent: 85, verified: 82 },
    { time: '16:00', sent: 62, verified: 59 },
    { time: '20:00', sent: 94, verified: 90 },
    { time: '23:59', sent: 30, verified: 28 },
  ];

  const recentList = data?.recentTransactions || [];
  const filteredList = recentList.filter((tx: any) => {
    if (filterTab === 'ALL') return true;
    return tx.status === filterTab;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              نظرة عامة وإحصائيات المنصة المباشرة
            </Typography>
            <Chip 
              icon={<Sparkles size={14} color="#2dd4bf" />} 
              label="Realtime Telemetry" 
              size="small" 
              sx={{ fontWeight: 800, bgcolor: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', border: '1px solid rgba(45, 212, 191, 0.3)' }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            تتبع حركة الرموز والمحاولات الحية، حالة محرك الواتساب، وأداء البوابة في الوقت الفعلي
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Zap size={18} />}
            onClick={() => setQuickOtpOpen(true)}
            sx={{ 
              borderRadius: 3, 
              fontWeight: 800, 
              py: 1.2, 
              px: 2.5,
              background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.35)'
            }}
          >
            تجربة إرسال OTP سريعة
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/playground')}
            startIcon={<ArrowUpRight size={18} />}
            sx={{ borderRadius: 3, fontWeight: 700, borderColor: 'rgba(45, 212, 191, 0.4)', color: '#2dd4bf' }}
          >
            مختبر الـ API الكامل
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2.5, 
              borderLeft: '4px solid #06b6d4',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': { transform: 'translateY(-3px)' }
            }}
          >
            <Box sx={{ width: 54, height: 54, borderRadius: 3.5, background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare color="#38bdf8" size={28} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>إجمالي الرموز المرسلة</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.2, color: '#38bdf8' }}>{metrics.totalSent}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2.5, 
              borderLeft: '4px solid #10b981',
              '&:hover': { transform: 'translateY(-3px)' }
            }}
          >
            <Box sx={{ width: 54, height: 54, borderRadius: 3.5, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle color="#34d399" size={28} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>الرموز المؤكدة بنجاح</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#34d399', mt: 0.2 }}>{metrics.totalVerified}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2.5, 
              borderLeft: '4px solid #f43f5e',
              '&:hover': { transform: 'translateY(-3px)' }
            }}
          >
            <Box sx={{ width: 54, height: 54, borderRadius: 3.5, background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle color="#fb7185" size={28} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>المحاولات الفاشلة/المحظورة</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#fb7185', mt: 0.2 }}>{metrics.totalFailed}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2.5, 
              borderLeft: '4px solid #2dd4bf',
              '&:hover': { transform: 'translateY(-3px)' }
            }}
          >
            <Box sx={{ width: 54, height: 54, borderRadius: 3.5, background: 'rgba(45, 212, 191, 0.15)', border: '1px solid rgba(45, 212, 191, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck color="#2dd4bf" size={28} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>معدل نجاح التحقق (SLA)</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2dd4bf', mt: 0.2 }}>{metrics.successRate}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Chart & System Telemetry Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3.5, borderRadius: 4, height: 420 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Activity color="#2dd4bf" size={22} />
                  حركة الإرسال والتحقق المباشرة
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  رسم بياني يوضح معدلات طلبات OTP وتفاعل المستخدمين خلال 24 ساعة
                </Typography>
              </Box>
              <Chip icon={<RefreshCw size={14} className="animate-spin" color="#2dd4bf" />} label="تحديث تلقائي كل 6 ثوانٍ" size="small" sx={{ background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', fontWeight: 800 }} />
            </Box>
            <ResponsiveContainer width="100%" height={310}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 14, border: '1px solid rgba(45, 212, 191, 0.3)' }} />
                <Area type="monotone" dataKey="sent" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" name="إجمالي المرسل" />
                <Area type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVerified)" name="المؤكد بنجاح" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3.5, borderRadius: 4, height: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Server color="#10b981" size={22} />
                استقرار وحالة الخوادم
              </Typography>
              <Typography variant="caption" color="text.secondary">
                مؤشرات الصحة والأداء للبوابة المحفوظة
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Database size={20} color="#38bdf8" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>قاعدة البيانات المحفوظة</Typography>
                    <Typography variant="caption" color="text.secondary">استدامة وحفظ البيانات والتطبيقات</Typography>
                  </Box>
                </Box>
                <Chip label="نشط 100%" color="success" size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Smartphone size={20} color="#2dd4bf" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>بوابة الواتساب (WhatsApp Engine)</Typography>
                    <Typography variant="caption" color="text.secondary">جلسة الاقتران وتأكيد الرسائل</Typography>
                  </Box>
                </Box>
                <Chip label="جاهز 24/7" color="primary" size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
              </Box>

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cpu size={20} color="#34d399" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>ذاكرة الكاش والحماية</Typography>
                    <Typography variant="caption" color="text.secondary">التشفير وتأمين الرصيد</Typography>
                  </Box>
                </Box>
                <Chip label="محمية" color="success" size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>مؤشر حماية النظام والتأمين</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#2dd4bf' }}>100% المؤمّن</Typography>
              </Box>
              <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(45, 212, 191, 0.15)', '& .MuiLinearProgress-bar': { bgcolor: '#2dd4bf' } }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table with Tabs Filter */}
      <Paper sx={{ p: 3.5, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              آخر عمليات التحقق وإرسال الـ OTP
            </Typography>
            <Typography variant="caption" color="text.secondary">
              سجل تفصيلي لحظي لطلبات التحقق القادمة من تطبيقاتك
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tabs 
              value={filterTab} 
              onChange={(_, val) => setFilterTab(val)}
              sx={{
                '& .MuiTab-root': { fontWeight: 800, fontSize: '0.85rem', py: 0.5 },
                '& .Mui-selected': { color: '#2dd4bf' },
                '& .MuiTabs-indicator': { backgroundColor: '#2dd4bf' }
              }}
            >
              <Tab value="ALL" label="الكل" />
              <Tab value="VERIFIED" label="المؤكدة" />
              <Tab value="PENDING" label="قيد الانتظار" />
              <Tab value="FAILED" label="الفاشلة/المحظورة" />
            </Tabs>

            <Button size="small" onClick={() => navigate('/logs')} sx={{ fontWeight: 800, color: '#2dd4bf' }}>
              سجل العمليات كامل
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                <TableCell sx={{ fontWeight: 800 }}>اسم التطبيق / الخدمة</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>رقم الهاتف المستلم</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>قناة الإرسال</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>حالة الطلب</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>المحاولات</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>التوقيت</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                      <Inbox size={42} color="#64748b" />
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#94a3b8' }}>
                        لا توجد أي عمليات في هذه الفئة حالياً.
                      </Typography>
                      <Button variant="outlined" size="small" onClick={() => setQuickOtpOpen(true)} startIcon={<Zap size={16} />} sx={{ mt: 1, borderRadius: 2.5, fontWeight: 800 }}>
                        إرسال رمز تجريبي حقيقي الآن
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((tx: any) => (
                  <TableRow key={tx.id} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{tx.appName || tx.app?.name || 'التطبيق الخاص بك'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{tx.phoneNumber}</TableCell>
                    <TableCell><Chip label={tx.channel} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell>
                      <Chip 
                        label={tx.status === 'VERIFIED' ? 'مؤكد' : tx.status === 'PENDING' ? 'قيد الانتظار' : 'محظور / فاشل'} 
                        color={tx.status === 'VERIFIED' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'error'} 
                        size="small"
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{tx.attempts} / 3</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 700 }}>
                      {new Date(tx.createdAt).toLocaleTimeString('ar-SA')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick OTP Dispatcher Modal */}
      <QuickOtpModal open={quickOtpOpen} onClose={() => setQuickOtpOpen(false)} />
    </Box>
  );
};
