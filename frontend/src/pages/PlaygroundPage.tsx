import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, Grid, Chip, CircularProgress, Tabs, Tab 
} from '@mui/material';
import { Send, CheckCircle2, RefreshCw, KeyRound, PhoneCall, Code, Terminal, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

export const PlaygroundPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+966501234567');
  const [apiKey, setApiKey] = useState('otp_live_key_production_99887766');
  const [code, setCode] = useState('');
  
  const [step, setStep] = useState<'SEND' | 'VERIFY'>('SEND');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [apiResponseJson, setApiResponseJson] = useState<any>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [codeLang, setCodeLang] = useState(0);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);
    const start = Date.now();

    try {
      const res = await api.post(
        '/api/v1/otp/send',
        {
          phoneNumber,
          channel: 'WHATSAPP',
          appId: 'app_default_01',
          expirySeconds: 300,
        },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      setLatencyMs(Date.now() - start);
      setApiResponseJson(res.data);
      setIsSuccess(true);
      setResultMessage(res.data.message || 'تم إرسال رمز التحقق OTP بنجاح عبر الواتساب!');
      setStep('VERIFY');
    } catch (err: any) {
      setLatencyMs(Date.now() - start);
      const errorData = err.response?.data || { success: false, statusCode: 400, message: 'فشل الإرسال عبر الواتساب' };
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
    const start = Date.now();

    try {
      const res = await api.post(
        '/api/v1/otp/verify',
        {
          phoneNumber,
          code,
        },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      setLatencyMs(Date.now() - start);
      setApiResponseJson(res.data);
      setIsSuccess(true);
      setResultMessage(res.data.message || 'تم التحقق من رمز OTP بنجاح!');
    } catch (err: any) {
      setLatencyMs(Date.now() - start);
      const errorData = err.response?.data || { success: false, statusCode: 400, message: 'رمز التحقق غير صحيح أو منتهي' };
      setApiResponseJson(errorData);
      setIsSuccess(false);
      setResultMessage(errorData.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const generateCurl = () => `curl -X POST https://your-domain.com/api/v1/otp/send \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "phoneNumber": "${phoneNumber}",
    "channel": "WHATSAPP"
  }'`;

  const generateNode = () => `const axios = require('axios');

const response = await axios.post('https://your-domain.com/api/v1/otp/send', {
  phoneNumber: '${phoneNumber}',
  channel: 'WHATSAPP'
}, {
  headers: { 'x-api-key': '${apiKey}' }
});

console.log(response.data);`;

  const generatePython = () => `import requests

url = "https://your-domain.com/api/v1/otp/send"
headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "phoneNumber": "${phoneNumber}",
    "channel": "WHATSAPP"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

  const generateFlutter = () => `import 'package:http/http.dart' as http;
import 'dart:convert';

final response = await http.post(
  Uri.parse('https://your-domain.com/api/v1/otp/send'),
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}',
  },
  body: jsonEncode({
    'phoneNumber': '${phoneNumber}',
    'channel': 'WHATSAPP',
  }),
);

print(response.body);`;

  const getCodeSnippet = () => {
    switch(codeLang) {
      case 0: return generateCurl();
      case 1: return generateNode();
      case 2: return generatePython();
      case 3: return generateFlutter();
      default: return generateCurl();
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            مختبر الـ API التفاعلي (Live Developer Playground)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            اختبار فوري لاستدعاءات الـ API توليد الأكواد لجميع لغات البرمجة وحزم SDK
          </Typography>
        </Box>

        <Chip 
          icon={<Terminal size={16} color="#2dd4bf" />} 
          label="API Status: 200 OK (Live)" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 800, py: 2.2, px: 1, borderRadius: 3, borderColor: 'rgba(45, 212, 191, 0.4)', color: '#2dd4bf' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Side: Test Interactive Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3.5, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneCall color="#2dd4bf" size={22} />
              واجهة اختبار الإرسال والتحقق المباشرة
            </Typography>

            {resultMessage && (
              <Alert 
                severity={isSuccess ? 'success' : 'error'} 
                icon={isSuccess ? <CheckCircle2 size={20} /> : undefined}
                sx={{ borderRadius: 3, fontWeight: 800 }}
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
                    startAdornment: <KeyRound size={18} color="#94a3b8" style={{ marginLeft: 8 }} />,
                  }}
                  helperText="تم استخدام مفتاح التجربة الافتراضي"
                />

                <TextField
                  fullWidth
                  label="رقم الهاتف المستلم (بالصيغة الدولية E.164)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  helperText="مثال: +966501234567"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                  sx={{ 
                    mt: 1, 
                    py: 1.5, 
                    borderRadius: 3.5, 
                    fontWeight: 800, 
                    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'جاري الإرسال والمعالجة...' : 'إرسال رمز OTP الفوري'}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip 
                  label={`جاري التحقق للرقم: ${phoneNumber}`} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: 800, borderRadius: 2, alignSelf: 'flex-start' }} 
                />

                <TextField
                  fullWidth
                  label="رمز الـ OTP المكون من 6 أرقام"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  placeholder="849201"
                  autoFocus
                />

                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || code.length < 4}
                    sx={{ py: 1.4, borderRadius: 3, fontWeight: 800, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    {loading ? 'جاري التأكيد...' : 'تأكيد الرمز المستلم'}
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

            {/* Code snippet generator header */}
            <Box sx={{ mt: 2, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
                  مولد الكود المباشر (SDK Snippets)
                </Typography>
                <Button size="small" startIcon={copiedCode ? <Check size={16} color="#10b981" /> : <Copy size={16} />} onClick={copySnippet} sx={{ fontWeight: 700 }}>
                  {copiedCode ? 'تم النسخ!' : 'نسخ الكود'}
                </Button>
              </Box>

              <Tabs value={codeLang} onChange={(_, val) => setCodeLang(val)} sx={{ '& .MuiTab-root': { fontWeight: 700, minWidth: 'auto', px: 2 } }}>
                <Tab label="cURL" />
                <Tab label="Node.js" />
                <Tab label="Python" />
                <Tab label="Flutter" />
              </Tabs>

              <Paper sx={{ p: 2, mt: 1, borderRadius: 3, bgcolor: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', overflow: 'auto' }}>
                <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#38bdf8', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {getCodeSnippet()}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Live JSON Response Inspector */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3.5, borderRadius: 4, height: '100%', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code color="#38bdf8" size={22} />
                استجابة السيرفر المباشرة (Server HTTP Response)
              </Typography>
              {latencyMs !== null && (
                <Chip label={`زمن الاستجابة: ${latencyMs} ms`} size="small" sx={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }} />
              )}
            </Box>

            <Paper 
              sx={{ 
                p: 2.5, 
                flexGrow: 1, 
                borderRadius: 3.5, 
                bgcolor: '#080c14', 
                border: '1px solid rgba(45, 212, 191, 0.2)',
                overflow: 'auto'
              }}
            >
              <Typography 
                variant="body2" 
                component="pre" 
                sx={{ 
                  fontFamily: 'monospace', 
                  color: apiResponseJson ? (isSuccess ? '#34d399' : '#fb7185') : '#64748b', 
                  fontSize: '0.88rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  margin: 0
                }}
              >
                {apiResponseJson 
                  ? JSON.stringify(apiResponseJson, null, 2) 
                  : `{\n  "status": "ready",\n  "message": "// قم باختبار الإرسال لتشاهد استجابة الـ API المباشرة هنا..."\n}`}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
