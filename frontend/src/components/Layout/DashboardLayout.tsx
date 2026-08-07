import React, { useState } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Chip 
} from '@mui/material';
import { 
  LayoutDashboard, KeyRound, MessageSquare, ShieldAlert, History, LogOut, 
  Sun, Moon, Globe, ShieldCheck, PlayCircle, Webhook 
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ColorModeContext';

const drawerWidth = 260;

export const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode, lang, changeLanguage } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { text: t('dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    { text: t('playground'), path: '/playground', icon: <PlayCircle size={20} /> },
    { text: t('applications'), path: '/apps', icon: <KeyRound size={20} /> },
    { text: t('whatsappConfig'), path: '/whatsapp', icon: <MessageSquare size={20} /> },
    { text: 'الـ Webhooks الفورية', path: '/webhooks', icon: <Webhook size={20} /> },
    { text: t('logsAndAudit'), path: '/logs', icon: <History size={20} /> },
    { text: t('securityCenter'), path: '/security', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(ellipse at top, #042f2e 0%, #041316 70%)' }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(20px)',
          backgroundColor: mode === 'dark' ? 'rgba(4, 19, 22, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: 'none',
          borderBottom: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid rgba(13, 148, 136, 0.15)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                width: 42, 
                height: 42, 
                borderRadius: 3.5, 
                background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(13, 148, 136, 0.4)',
              }}
            >
              <ShieldCheck color="#ffffff" size={24} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('platformTitle')}
            </Typography>
            <Chip label="v1.0 Enterprise" size="small" color="primary" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700, borderRadius: 2 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <IconButton onClick={() => changeLanguage(lang === 'ar' ? 'en' : 'ar')} color="inherit">
              <Globe size={20} />
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 700 }}>
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
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', pl: 1, pr: 1, py: 0.5, borderRadius: 3, '&:hover': { background: 'rgba(45, 212, 191, 0.1)' } }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#0d9488', fontSize: '0.95rem', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.name || 'Admin User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role || 'OPERATOR'}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 3 } }}
            >
              <MenuItem onClick={logout}>
                <ListItemIcon><LogOut size={18} /></ListItemIcon>
                <ListItemText primary={t('logout')} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: mode === 'dark' ? 'rgba(4, 19, 22, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRight: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.12)' : '1px solid rgba(13, 148, 136, 0.12)',
            borderLeft: mode === 'dark' ? '1px solid rgba(45, 212, 191, 0.12)' : '1px solid rgba(13, 148, 136, 0.12)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2, py: 3 }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {navItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isSelected}
                    sx={{
                      borderRadius: 3,
                      py: 1.3,
                      px: 2,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                        color: '#ffffff',
                        boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                        '& .MuiListItemIcon-root': { color: '#ffffff' },
                        '&:hover': { background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#ffffff' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.95rem' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main View Container */}
      <Box component="main" sx={{ flexGrow: 1, p: 3.5, pt: 11.5, width: `calc(100% - ${drawerWidth}px)` }}>
        <Outlet />
      </Box>
    </Box>
  );
};
