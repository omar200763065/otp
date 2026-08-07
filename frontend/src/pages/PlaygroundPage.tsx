import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Grid, Chip, CircularProgress 
} from '@mui/material';
import { Send, CheckCircle2, RefreshCw, KeyRound, PhoneCall, Code } from 'lucide-react';
import { api } from '../services/api';

export const PlaygroundPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+966500000000');
  const [apiKey, setApiKey] = useState('otp_live_demo_key_998877665544332211');
  const [code, setCode] = useState('');
  
  const [step, setStep] = useState<'SEND' | 'VERIFY'>('SEND');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [apiResponseJson, setApiResponseJson] = useState<any>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    try {
      const res = await api.post(
        '/api/v1/send-otp',
        {
          phoneNumber,
          channel: 'WHATSAPP',
          language: 'ar',
        },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      setApiResponseJson(res.data);
      setIsSuccess(true);
      setResultMessage(res.data.message || 'تم إرسال رمز التحقق بنجاح عبر الواتساب!');
      setStep('VERIFY');
    } catch (err: any) {
      const errorData = err.response?.data || { message: 'فشل إرسال رمز OTP' };
      setApiResponseJson(errorData);
      setIsSuccess(false);
      setResultMessage(errorData.message || 'فشل إرسال رمز OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    try {
      const res = await api.post(
        '/api/v1/verify-otp',
        {
          phoneNumber,
          code,
        },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      setApiResponseJson(res.data);
      setIsSuccess(true);
      setResultMessage(res.data.message || 'تم التحقق من الكود بنجاح!');
    } catch (err: any) {
      const errorData = err.response?.data || { message: 'رمز التحقق غير صحيح' };
      setApiResponseJson(errorData);
      setIsSuccess(false);
      setResultMessage(errorData.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        تجربة وإرسال OTP المباشر (API Live Playground)
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Test Interactive Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3.5, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneCall color="#6366f1" size={22} />
              اختبار الخدمة التفاعلية
            </Typography>

            {resultMessage && (
              <Alert 
                severity={isSuccess ? 'success' : 'error'} 
                icon={isSuccess ? <CheckCircle2 size={20} /> : undefined}
                sx={{ borderRadius: 3, fontWeight: 700 }}
              >
                {resultMessage}
              </Alert>
            )}

            {step === 'SEND' ? (
              <Box component="form" onSubmit={handleSendOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="مفتاح الـ API Key المستعمل"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  InputProps={{
                    startAdornment: <KeyRound size={18} color="#9ca3af" style={{ marginLeft: 8 }} />,
                  }}
                  helperText="تم وضع مفتاح التجربة المباشر افتراضياً"
                />

                <TextField
                  fullWidth
                  label="رقم الهاتف المستلم (بالصيغة الدولية E.164)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  helperText="مثال: +966500000000 أو +9647700000000"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                  sx={{ 
                    mt: 1, 
                    py: 1.4, 
                    borderRadius: 3, 
                    fontWeight: 700, 
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'جاري الإرسال عبر الواتساب...' : 'إرسال كود OTP الآن'}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip 
                  label={`جاري التحقق للرقم: ${phoneNumber}`} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: 700, borderRadius: 2, alignSelf: 'flex-start' }} 
                />

                <TextField
                  fullWidth
                  label="رمز الـ OTP المكون من 6 أرقام"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  placeholder="123456"
                  autoFocus
                />

                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || code.length < 6}
                    sx={{ py: 1.4, borderRadius: 3, fontWeight: 700, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    {loading ? 'جاري التأكيد...' : 'تأكيد الرمز'}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setStep('SEND')}
                    startIcon={<RefreshCw size={16} />}
                    sx={{ borderRadius: 3, fontWeight: 700 }}
                  >
                    إعادة الطلب
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side: Live JSON Response Inspector */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Code color="#a855f7" size={20} />
              استجابة السيرفر المباشرة (Live Server JSON Response)
            </Typography>

            <Paper 
              sx={{ 
                p: 2, 
                flexGrow: 1, 
                borderRadius: 3, 
                bgcolor: '#0f172a', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'auto'
              }}
            >
              <Typography 
                variant="body2" 
                component="pre" 
                sx={{ 
                  fontFamily: 'monospace', 
                  color: apiResponseJson ? '#38bdf8' : '#64748b', 
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {apiResponseJson 
                  ? JSON.stringify(apiResponseJson, null, 2) 
                  : '// قم باختبار الإرسال لتشاهد استجابة الـ API المباشرة هنا...'}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
