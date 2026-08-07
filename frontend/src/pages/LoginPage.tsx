import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@otpsaas.com');
  const [password, setPassword] = useState('AdminPassword123!');
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
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.');
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
        background: 'radial-gradient(circle at center, #1e1b4b 0%, #0b0f19 100%)',
        p: 2 
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box 
          sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
          }}
        >
          <ShieldCheck color="#ffffff" size={32} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, textAlign: 'center' }}>
          تسجيل الدخول لوحة التحكّم
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          منصة OTP SaaS المستقلة الجاهزة للإنتاج
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <TextField
            fullWidth
            label="كلمة المرور"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock size={20} />}
            sx={{ 
              py: 1.5, 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            {loading ? 'جاري التحقق...' : 'دخول المنصة'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
