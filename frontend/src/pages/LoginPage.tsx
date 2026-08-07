import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, CircularProgress, 
  InputAdornment, IconButton, Chip 
} from '@mui/material';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Zap, KeyRound, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@otpsaas.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login Error:', err);
      const detail = err.response?.data?.message 
        || (err.response?.status ? `خطأ الاستجابة HTTP Status [${err.response.status}]: ${err.message}` : null)
        || err.message 
        || 'تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل الباك إند.';
      setErrorDetails(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorDetails(null);
    try {
      await login('admin@otpsaas.com', 'AdminPassword123!');
      navigate('/', { replace: true });
    } catch (err: any) {
      setErrorDetails(err?.message || 'خطأ في الدخول التلقائي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 25%, #0f2733 0%, #080c14 75%)',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Decorative Lighting Orbs */}
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(13, 148, 136, 0.18)', filter: 'blur(100px)', top: '-15%', right: '10%' }} />
      <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(6, 182, 212, 0.14)', filter: 'blur(90px)', bottom: '-15%', left: '10%' }} />

      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 5,
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(13, 148, 136, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Icon */}
        <Box 
          sx={{ 
            width: 68, 
            height: 68, 
            borderRadius: 4.5, 
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
            boxShadow: '0 10px 30px rgba(13, 148, 136, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <ShieldCheck color="#ffffff" size={40} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.8, textAlign: 'center', background: 'linear-gradient(90deg, #f8fafc, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          تسجيل الدخول - منصة OTP SaaS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center', lineHeight: 1.6 }}>
          لوحة تحكّم الجيل الجديد للتحقق بخطوتين وتأمين الـ API
        </Typography>

        <Chip 
          icon={<ShieldAlert size={14} color="#2dd4bf" />} 
          label="حماية مشددة وتشغيل تلقائي مؤمّن" 
          size="small" 
          sx={{ 
            mb: 3, 
            background: 'rgba(13, 148, 136, 0.15)', 
            border: '1px solid rgba(45, 212, 191, 0.3)',
            color: '#2dd4bf',
            fontWeight: 800,
            fontSize: '0.78rem'
          }} 
        />

        {/* Detailed Error Printing Alert */}
        {errorDetails && (
          <Alert 
            severity="error" 
            icon={<AlertTriangle size={20} color="#fb7185" />}
            sx={{ 
              width: '100%', 
              mb: 3, 
              borderRadius: 3, 
              backgroundColor: 'rgba(244, 63, 94, 0.15)', 
              border: '1px solid rgba(244, 63, 94, 0.3)', 
              color: '#fecdd3',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f87171', mb: 0.5 }}>
              تفاصيل المشكلة والخطأ (Error Trace):
            </Typography>
            {errorDetails}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="البريد الإلكتروني للمسؤول"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color="#94a3b8" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" color="inherit">
                    {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <KeyRound size={20} />}
            sx={{ 
              py: 1.6, 
              borderRadius: 3.5, 
              background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#ffffff',
              boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)',
                boxShadow: '0 12px 30px rgba(13, 148, 136, 0.6)',
              }
            }}
          >
            {loading ? 'جاري التحقق والدخول...' : 'دخول لوحة التحكم'}
          </Button>
        </Box>

        {/* Quick Instant Demo Login Button */}
        <Box sx={{ width: '100%', mt: 3, pt: 2.5, borderTop: '1px dashed rgba(255, 255, 255, 0.12)', textAlign: 'center' }}>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            startIcon={<Zap size={18} color="#f59e0b" />}
            sx={{ 
              py: 1.2,
              borderRadius: 3,
              borderColor: 'rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              fontWeight: 800,
              fontSize: '0.9rem',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                borderColor: '#f59e0b',
              } 
            }}
          >
            دخول فوري تجريبي بضغطة واحدة (One-Click Instant Login)
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
