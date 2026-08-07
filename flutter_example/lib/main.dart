import 'package:flutter/material.dart';
import 'screens/otp_verification_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OTP Client Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: OtpVerificationScreen(
        phoneNumber: '+966500000000',
        baseUrl: 'http://localhost:3000', // Or your VPS URL e.g. https://otp.yourdomain.com
        apiKey: 'otp_live_demo_key_998877665544332211',
        onVerificationSuccess: () {
          print('🎉 Verification successful!');
        },
      ),
    );
  }
}
