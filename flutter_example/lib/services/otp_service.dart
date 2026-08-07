import 'dart:convert';
import 'package:http/http.dart' as http;

class OtpResult {
  final bool success;
  final String message;
  final String? transactionId;
  final int? cooldownSeconds;
  final int? remainingAttempts;

  OtpResult({
    required this.success,
    required this.message,
    this.transactionId,
    this.cooldownSeconds,
    this.remainingAttempts,
  });
}

class OtpClientService {
  final String baseUrl;
  final String apiKey;

  OtpClientService({
    required this.baseUrl,
    required this.apiKey,
  });

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      };

  /// Sends OTP to international phone number in E.164 format (+966500000000)
  Future<OtpResult> sendOtp({
    required String phoneNumber,
    String? templateName,
    String language = 'ar',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/send-otp'),
        headers: _headers,
        body: jsonEncode({
          'phoneNumber': phoneNumber,
          'channel': 'WHATSAPP',
          'templateName': templateName,
          'language': language,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return OtpResult(
          success: true,
          message: data['message'] ?? 'تم إرسال رمز OTP بنجاح',
          transactionId: data['transactionId'],
          cooldownSeconds: data['cooldownSeconds'],
        );
      } else {
        return OtpResult(
          success: false,
          message: data['message'] ?? 'فشل إرسال رمز التحقق',
          cooldownSeconds: data['remainingCooldownSeconds'],
        );
      }
    } catch (e) {
      return OtpResult(
        success: false,
        message: 'خطأ في الاتصال بالخادم: $e',
      );
    }
  }

  /// Verifies 6-digit OTP code entered by user
  Future<OtpResult> verifyOtp({
    required String phoneNumber,
    required String code,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/verify-otp'),
        headers: _headers,
        body: jsonEncode({
          'phoneNumber': phoneNumber,
          'code': code,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return OtpResult(
          success: true,
          message: data['message'] ?? 'تم التحقق بنجاح',
        );
      } else {
        return OtpResult(
          success: false,
          message: data['message'] ?? 'رمز التحقق غير صحيح',
          remainingAttempts: data['remainingAttempts'],
        );
      }
    } catch (e) {
      return OtpResult(
        success: false,
        message: 'خطأ في الاتصال بالخادم: $e',
      );
    }
  }

  /// Resends OTP code
  Future<OtpResult> resendOtp({required String phoneNumber}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/resend-otp'),
        headers: _headers,
        body: jsonEncode({'phoneNumber': phoneNumber}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return OtpResult(
          success: true,
          message: data['message'] ?? 'تمت إعادة الإرسال بنجاح',
          transactionId: data['transactionId'],
        );
      } else {
        return OtpResult(
          success: false,
          message: data['message'] ?? 'فشلت إعادة الإرسال',
        );
      }
    } catch (e) {
      return OtpResult(
        success: false,
        message: 'خطأ في الاتصال بالخادم: $e',
      );
    }
  }
}
