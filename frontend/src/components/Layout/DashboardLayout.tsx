import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Chip, useMediaQuery, useTheme 
} from '@mui/material';
import { 
  LayoutDashboard, KeyRound, MessageSquare, ShieldAlert, History, LogOut, 
  Sun, Moon, Globe, ShieldCheck, PlayCircle, Webhook, Menu as MenuIcon, Wifi
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ColorModeContext';

const drawerWidth = 270;

export const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode, lang, changeLanguage } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { text: t('dashboard') || 'لوحة القيادة', path: '/', icon: <LayoutDashboard size={20} /> },
    { text: t('playground') || 'مختبر الـ API', path: '/playground', icon: <PlayCircle size={20} /> },
    { text: t('applications') || 'التطبيقات والمفاتيح', path: '/apps', icon: <KeyRound size={20} /> },
    { text: t('whatsappConfig') || 'بوابة الواتساب', path: '/whatsapp', icon: <MessageSquare size={20} /> },
    { text: 'الـ Webhooks الفورية', path: '/webhooks', icon: <Webhook size={20} /> },
    { text: t('logsAndAudit') || 'سجل العمليات والـ Audit', path: '/logs', icon: <History size={20} /> },
    { text: t('securityCenter') || 'مركز الأمان والحماية', path: '/security', icon: <ShieldAlert size={20} /> },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', px: 2, py: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 3 }}>
        <Box 
          sx={{ 
            width: 44, 
            height: 44, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(13, 148, 136, 0.4)',
          }}
        >
          <ShieldCheck color="#ffffff" size={26} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            OTP SAAS PRO
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: -0.5 }}>
            منصة التحقق الفوري
          </Typography>
        </Box>
      </Box>

      {/* System Live Status Pill */}
      <Box 
        sx={{ 
          p: 1.5, 
          mb: 3, 
          borderRadius: 3, 
          background: mode === 'dark' ? 'rgba(13, 148, 136, 0.1)' : 'rgba(13, 148, 136, 0.08)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#2dd4bf', display: 'block', lineHeight: 1.1 }}>
            النظام يعمل بكفاءة 100%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
            زمن الاستجابة: 1.2 ثانية
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {navItems.map((item) => {
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
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.25s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                    color: '#ffffff',
                    boxShadow: '0 6px 20px rgba(13, 148, 136, 0.35)',
                    '& .MuiListItemIcon-root': { color: '#ffffff' },
                    '&:hover': { background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isSelected ? '#ffffff' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isSelected ? 800 : 600, fontSize: '0.92rem' }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Version Footer */}
      <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <Chip 
          label="Enterprise Edition v1.0.0" 
          size="small" 
          color="primary" 
          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 800, borderRadius: 2, background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }} 
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: mode === 'dark' ? 'radial-gradient(ellipse at top, #0f1c2e 0%, #080c14 70%)' : '#f8fafc' }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(24px)',
          backgroundColor: mode === 'dark' ? 'rgba(8, 12, 20, 0.82)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: 'none',
          borderBottom: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid rgba(13, 148, 136, 0.12)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} color="inherit">
                <MenuIcon size={24} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' }, background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              منصة OTP المؤمّنة
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <IconButton onClick={() => changeLanguage(lang === 'ar' ? 'en' : 'ar')} color="inherit">
              <Globe size={18} />
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 700, fontSize: '0.85rem' }}>
                {lang === 'ar' ? 'EN' : 'عربي'}
              </Typography>
            </IconButton>

            {/* Dark/Light Mode Toggle */}
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#0d9488" />}
            </IconButton>

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
                border: '1px solid rgba(45, 212, 191, 0.2)',
                background: mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                '&:hover': { background: 'rgba(45, 212, 191, 0.15)' } 
              }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#0d9488', fontSize: '0.9rem', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.name || 'مدير النظام'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  {user?.role || 'SUPER_ADMIN'}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 3.5, p: 0.5 } }}
            >
              <MenuItem onClick={logout} sx={{ borderRadius: 2, py: 1, color: '#f43f5e' }}>
                <ListItemIcon><LogOut size={18} color="#f43f5e" /></ListItemIcon>
                <ListItemText primary={t('logout') || 'تسجيل الخروج'} primaryTypographyProps={{ fontWeight: 700 }} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Responsive Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
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
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: mode === 'dark' ? 'rgba(8, 12, 20, 0.65)' : 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(24px)',
              borderRight: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.12)' : '1px solid rgba(13, 148, 136, 0.12)',
              borderLeft: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.12)' : '1px solid rgba(13, 148, 136, 0.12)',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Main View Container */}
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
    </Box>
  );
};
