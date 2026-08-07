import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, CircularProgress, 
  InputAdornment, IconButton, Chip 
} from '@mui/material';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Zap, KeyRound, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@otpsaas.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من صحة البيانات المسجلة.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail('admin@otpsaas.com');
    setPassword('AdminPassword123!');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 20%, #0d2830 0%, #080c14 70%)',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Decorative Glow Orbs */}
      <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(13, 148, 136, 0.15)', filter: 'blur(90px)', top: '-10%', right: '15%' }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(80px)', bottom: '-10%', left: '15%' }} />

      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 5,
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(13, 148, 136, 0.15)',
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
            width: 64, 
            height: 64, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
            boxShadow: '0 10px 30px rgba(13, 148, 136, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <ShieldCheck color="#ffffff" size={36} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.8, textAlign: 'center', background: 'linear-gradient(90deg, #f8fafc, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          بوابة إدارة OTP SaaS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', lineHeight: 1.6 }}>
          لوحة تحكّم الجيل الجديد للتحقق بخطوتين وتأمين الـ API
        </Typography>

        <Chip 
          icon={<ShieldAlert size={14} color="#2dd4bf" />} 
          label="حماية مشددة تشفير AES-256-GCM" 
          size="small" 
          sx={{ 
            mb: 3, 
            background: 'rgba(13, 148, 136, 0.15)', 
            border: '1px solid rgba(45, 212, 191, 0.3)',
            color: '#2dd4bf',
            fontWeight: 700,
            fontSize: '0.78rem'
          }} 
        />

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 3, backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fecdd3' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
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
            {loading ? 'جاري التحقق والأمان...' : 'دخول النظام الآمن'}
          </Button>
        </Box>

        {/* Quick Demo Fill Option */}
        <Box sx={{ width: '100%', mt: 3, pt: 2.5, borderTop: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <Button
            size="small"
            onClick={handleQuickFillDemo}
            startIcon={<Zap size={15} color="#f59e0b" />}
            sx={{ 
              color: '#94a3b8', 
              fontSize: '0.82rem',
              '&:hover': { color: '#2dd4bf', background: 'rgba(45, 212, 191, 0.08)' } 
            }}
          >
            تعبئة تلقائية لبيانات المسؤول التجريبي
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
