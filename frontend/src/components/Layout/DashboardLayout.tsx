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
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0b0f19 70%)' }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(16px)',
          backgroundColor: mode === 'dark' ? 'rgba(11, 15, 25, 0.75)' : 'rgba(255, 255, 255, 0.75)',
          boxShadow: 'none',
          borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              <ShieldCheck color="#ffffff" size={24} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('platformTitle')}
            </Typography>
            <Chip label="v1.0 Enterprise" size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }} />
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
              {mode === 'dark' ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#6366f1" />}
            </IconButton>

            {/* User Profile */}
            <Box 
              onClick={(e) => setAnchorEl(e.currentTarget)} 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', pl: 1, pr: 1, py: 0.5, borderRadius: 3, '&:hover': { background: 'rgba(255, 255, 255, 0.05)' } }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#6366f1', fontSize: '0.9rem', fontWeight: 700 }}>
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
            backgroundColor: mode === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(16px)',
            borderRight: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            borderLeft: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
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
                      py: 1.2,
                      px: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-selected': {
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                        '& .MuiListItemIcon-root': { color: '#ffffff' },
                        '&:hover': { backgroundColor: '#4f46e5' },
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 11, width: `calc(100% - ${drawerWidth}px)` }}>
        <Outlet />
      </Box>
    </Box>
  );
};
