import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Chip, 
  useMediaQuery, useTheme, TextField, InputAdornment, Tooltip, Badge, Button 
} from '@mui/material';
import { 
  LayoutDashboard, KeyRound, MessageSquare, ShieldAlert, History, LogOut, 
  Sun, Moon, Globe, ShieldCheck, PlayCircle, Webhook, Menu as MenuIcon, Zap, 
  Bell, Search, Activity, ChevronLeft, Sparkles, Cpu, Layers
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ColorModeContext';
import { QuickOtpModal } from '../Modals/QuickOtpModal';
import { NotificationsDrawer } from '../Drawers/NotificationsDrawer';

const drawerWidth = 285;

export const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [quickOtpOpen, setQuickOtpOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode, lang, changeLanguage } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  interface NavItem {
    text: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
    highlight?: boolean;
  }

  const navCategories: { title: string; items: NavItem[] }[] = [
    {
      title: 'الرئيسية والتحليلات',
      items: [
        { text: t('dashboard') || 'لوحة القيادة والمؤشرات', path: '/', icon: <LayoutDashboard size={20} />, badge: 'LIVE' },
        { text: t('playground') || 'مختبر الـ API التفاعلي', path: '/playground', icon: <PlayCircle size={20} /> },
      ]
    },
    {
      title: 'إدارة القنوات والربط',
      items: [
        { text: t('applications') || 'التطبيقات والمفاتيح', path: '/apps', icon: <KeyRound size={20} /> },
        { text: t('whatsappConfig') || 'بوابة الواتساب (WhatsApp Engine)', path: '/whatsapp', icon: <MessageSquare size={20} />, highlight: true },
        { text: 'الـ Webhooks الفورية', path: '/webhooks', icon: <Webhook size={20} /> },
      ]
    },
    {
      title: 'الأمان والنظام',
      items: [
        { text: t('logsAndAudit') || 'سجل العمليات والـ Audit', path: '/logs', icon: <History size={20} /> },
        { text: t('securityCenter') || 'مركز الأمان والحماية', path: '/security', icon: <ShieldAlert size={20} /> },
      ]
    }
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', px: 2.2, py: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 2.5 }}>
        <Box 
          sx={{ 
            width: 46, 
            height: 46, 
            borderRadius: 3.5, 
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(13, 148, 136, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <ShieldCheck color="#ffffff" size={28} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.15rem', background: 'linear-gradient(90deg, #2dd4bf 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              OTP SAAS PRO
            </Typography>
            <Chip label="PRO" color="primary" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 900, px: 0.2, background: 'linear-gradient(90deg, #0d9488, #06b6d4)' }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mt: -0.2 }}>
            بوابة التحقق الفوري والواتساب
          </Typography>
        </Box>
      </Box>

      {/* Sidebar Quick Search Bar */}
      <Box sx={{ mb: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="بحث سريع القائمة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '0.85rem',
              bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
            }
          }}
        />
      </Box>

      {/* System Live Telemetry Card */}
      <Box 
        sx={{ 
          p: 1.8, 
          mb: 2.5, 
          borderRadius: 3.5, 
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)' 
            : 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
              المحرك متصل ويعمل
            </Typography>
          </Box>
          <Chip label="24ms" size="small" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 800, bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.74rem', lineHeight: 1.3 }}>
          محرك الواتساب والـ API متزامنان بكفاءة عالية 99.98%
        </Typography>
      </Box>

      {/* Navigation Categories */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navCategories.map((cat, idx) => {
          const filteredItems = cat.items.filter(i => i.text.toLowerCase().includes(searchQuery.toLowerCase()));
          if (filteredItems.length === 0) return null;

          return (
            <Box key={idx}>
              <Typography variant="caption" sx={{ px: 1, mb: 1, display: 'block', fontWeight: 800, color: 'text.secondary', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                {cat.title}
              </Typography>
              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {filteredItems.map((item) => {
                  const isSelected = location.pathname === item.path;
                  return (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) setMobileOpen(false);
                        }}
                        selected={isSelected}
                        sx={{
                          borderRadius: 3,
                          py: 1.1,
                          px: 1.8,
                          transition: 'all 0.25s ease',
                          border: isSelected ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid transparent',
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                            color: '#ffffff',
                            boxShadow: '0 8px 22px rgba(13, 148, 136, 0.38)',
                            '& .MuiListItemIcon-root': { color: '#ffffff' },
                            '&:hover': { background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)' },
                          },
                          '&:hover': {
                            bgcolor: mode === 'dark' ? 'rgba(45, 212, 191, 0.08)' : 'rgba(13, 148, 136, 0.08)',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#ffffff' : 'text.secondary' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ fontWeight: isSelected ? 800 : 600, fontSize: '0.88rem' }} 
                        />
                        {item.badge && (
                          <Chip label={item.badge} size="small" color="secondary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      {/* Bottom Version & Quick Action Footer */}
      <Box sx={{ mt: 'auto', pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setQuickOtpOpen(true)}
          startIcon={<Zap size={16} />}
          sx={{ 
            py: 1, 
            borderRadius: 3, 
            fontWeight: 800, 
            fontSize: '0.82rem',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)' 
          }}
        >
          اختبار إرسال OTP حية
        </Button>
        <Chip 
          label="Enterprise Cloud Engine v1.0.0" 
          size="small" 
          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'rgba(45, 212, 191, 0.12)', color: '#2dd4bf' }} 
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: mode === 'dark' ? 'radial-gradient(ellipse at top, #0f1c2e 0%, #080c14 70%)' : '#f8fafc' }}>
      {/* Top Header Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(24px)',
          backgroundColor: mode === 'dark' ? 'rgba(8, 12, 20, 0.85)' : 'rgba(255, 255, 255, 0.88)',
          boxShadow: 'none',
          borderBottom: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid rgba(13, 148, 136, 0.12)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} color="inherit">
                <MenuIcon size={24} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '1rem', sm: '1.25rem' }, background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              منصة التحقق الفوري المتقدمة (OTP SaaS Engine)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            {/* Quick OTP Dispatcher Button */}
            <Tooltip title="اختبار إرسال رمز OTP فوري عبر الواتساب">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setQuickOtpOpen(true)}
                startIcon={<Zap size={16} color="#2dd4bf" />}
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  borderRadius: 3, 
                  fontWeight: 800, 
                  fontSize: '0.82rem',
                  borderColor: 'rgba(45, 212, 191, 0.4)',
                  color: '#2dd4bf',
                  '&:hover': { bgcolor: 'rgba(45, 212, 191, 0.15)' }
                }}
              >
                اختبار إرسال OTP
              </Button>
            </Tooltip>

            {/* Notification Bell */}
            <Tooltip title="التنبيهات الحية">
              <IconButton onClick={() => setNotifOpen(true)} color="inherit">
                <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { background: '#2dd4bf', color: '#000', fontWeight: 800 } }}>
                  <Bell size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Language Switcher */}
            <Tooltip title="تغيير اللغة">
              <IconButton onClick={() => changeLanguage(lang === 'ar' ? 'en' : 'ar')} color="inherit">
                <Globe size={18} />
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 700, fontSize: '0.85rem' }}>
                  {lang === 'ar' ? 'EN' : 'عربي'}
                </Typography>
              </IconButton>
            </Tooltip>

            {/* Dark/Light Mode Toggle */}
            <Tooltip title="تبديل المظهر">
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === 'dark' ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#0d9488" />}
              </IconButton>
            </Tooltip>

            {/* User Profile */}
            <Box 
              onClick={(e) => setAnchorEl(e.currentTarget)} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.2, 
                cursor: 'pointer', 
                px: 1.5, 
                py: 0.6, 
                borderRadius: 3, 
                border: '1px solid rgba(45, 212, 191, 0.25)',
                background: mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.85)',
                transition: 'all 0.25s ease',
                '&:hover': { background: 'rgba(45, 212, 191, 0.18)', borderColor: '#2dd4bf' } 
              }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#0d9488', fontSize: '0.9rem', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {user?.name || 'مدير النظام'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', fontWeight: 700 }}>
                  {user?.role || 'SUPER_ADMIN'}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ 
                sx: { 
                  mt: 1.5, 
                  minWidth: 210, 
                  borderRadius: 3.5, 
                  p: 0.8,
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%)',
                  border: '1px solid rgba(45, 212, 191, 0.25)' 
                } 
              }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
                  {user?.email || 'admin@otpsaas.com'}
                </Typography>
                <Chip label="الحساب نشط ورسمي" color="success" size="small" sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }} />
              </Box>
              <MenuItem onClick={logout} sx={{ borderRadius: 2, py: 1, color: '#f43f5e', mt: 0.5 }}>
                <ListItemIcon><LogOut size={18} color="#f43f5e" /></ListItemIcon>
                <ListItemText primary={t('logout') || 'تسجيل الخروج'} primaryTypographyProps={{ fontWeight: 800 }} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer (Pinned to the Right Side) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: mode === 'dark' ? 'rgba(8, 12, 20, 0.96)' : '#ffffff',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: mode === 'dark' ? 'rgba(8, 12, 20, 0.72)' : 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px)',
              borderLeft: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.18)' : '1px solid rgba(13, 148, 136, 0.18)',
              borderRight: 'none',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Main View Outlet */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2.5, sm: 4 }, 
          pt: { xs: 10, sm: 12 }, 
          width: { md: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Outlet />
      </Box>

      {/* Modals & Drawers */}
      <QuickOtpModal open={quickOtpOpen} onClose={() => setQuickOtpOpen(false)} />
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </Box>
  );
};
