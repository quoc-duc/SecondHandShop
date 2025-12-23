import 'package:flutter/material.dart';
import '../core/models/user_model.dart';
import '../core/services/api_service.dart';

class SignUpProvider with ChangeNotifier {
  User? _user;
  String _message = "";
  bool _isLoading = false;

  User? get user => _user;
  String get message => _message;
  bool get isLoading => _isLoading;

  Future<void> signUp({
    required String username,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.post(
        'users',
        {"username": username, "email": email, "password": password},
      );

      _message = response['message'] ?? 'Đăng ký thành công!';
    } catch (e) {
      _message = "Lỗi kết nối đến server! ${e.toString()}";
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> sendOtp(String email) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.post('mail/send-otp', {"email": email});
      _message = response['message'] ?? 'Lỗi gửi OTP!';
    } catch (e) {
      _message = "Lỗi kết nối đến server!";
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> verifyOtp(String email, String otp) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.post(
          'mail/verify-otp', {"email": email, "otp": otp});
      _message = response['message'] ?? 'Xác thực OTP thành công!';
    } catch (e) {
      _message = "Lỗi kết nối đến server!";
    }

    _isLoading = false;
    notifyListeners();
  }
}
