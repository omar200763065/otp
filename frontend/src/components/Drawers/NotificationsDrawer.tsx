import React from 'react';
import { 
  Drawer, Box, Typography, IconButton, List, ListItem, 
  ListItemIcon, ListItemText, Chip, Button, Divider 
} from '@mui/material';
import { Bell, X, CheckCircle2, AlertTriangle, ShieldCheck, MessageSquare, Zap, Clock } from 'lucide-react';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ open, onClose }) => {
  const notifications = [
    {
      id: '1',
      title: 'اتصال محرك الواتساب بنجاح',
      description: 'جلسة اقتران Baileys QR Web نشطة ومتصلة بالرقم المسجل.',
      time: 'منذ دقيقتين',
      type: 'success',
      icon: <CheckCircle2 size={18} color="#10b981" />,
    },
    {
      id: '2',
      title: 'ارتفاع سرعة الاستجابة (Latency Optimization)',
      description: 'متوسط زمن معالجة طلبات الـ OTP انخفض إلى 38ms.',
      time: 'منذ 15 دقيقة',
      type: 'info',
      icon: <Zap size={18} color="#38bdf8" />,
    },
    {
      id: '3',
      title: 'حظر محاولة وصول غير مصرح بها',
      description: 'جدار حماية الـ IP قام بحجب العنوان (194.26.29.11) لتجاوز حد المحاولات.',
      time: 'منذ ساعة',
      type: 'warning',
      icon: <AlertTriangle size={18} color="#f59e0b" />,
    },
    {
      id: '4',
      title: 'تحديث قوالب Meta Cloud API',
      description: 'قالب otp_verification_code مقبول وجاهز للإرسال.',
      time: 'منذ ساعتين',
      type: 'success',
      icon: <ShieldCheck size={18} color="#0d9488" />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 12, 20, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(45, 212, 191, 0.2)',
          p: 2.5,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'rgba(45, 212, 191, 0.15)', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
            <Bell size={20} color="#2dd4bf" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              تنبيهات النظام الحية
            </Typography>
            <Typography variant="caption" color="text.secondary">
              تتبع أحداث السيرفر وبوابة OTP في الوقت الفعلي
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {notifications.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(45, 212, 191, 0.06)',
                borderColor: 'rgba(45, 212, 191, 0.2)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  {item.title}
                </Typography>
              </Box>
              <Chip 
                label={item.time} 
                size="small" 
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.secondary' }} 
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
              {item.description}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Button fullWidth variant="outlined" onClick={onClose} sx={{ borderRadius: 3, fontWeight: 700 }}>
          تعيين الكل كـ مقروء
        </Button>
      </Box>
    </Drawer>
  );
};
