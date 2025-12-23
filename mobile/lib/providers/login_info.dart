import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';
import '../core/models/user_model.dart';

class LoginInfo with ChangeNotifier {
  String? _token;
  bool _isLoggedIn = false;
  User? _user; // Lưu toàn bộ thông tin user

  String? get token => _token;
  bool get isLoggedIn => _isLoggedIn;
  // User? get user => _user;

  // Thêm các getter để truy cập thông tin từ User
  String? get id => _user?.id;
  String? get name => _user?.name;
  String? get avatarurl => _user?.avatarUrl;
  String? get role => _user?.role;
  String? get email => _user?.email;
  String? get password => _user?.password;
  String? get username => _user?.username;
  String? get address => _user?.address;
  String? get phone => _user?.phone;
  String? get provinceId => _user?.provinceId;
  String? get districtId => _user?.districtId;

  Future<bool> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://$ip:5555/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final String token = data['token'];

        final userResponse = await http.post(
          Uri.parse('http://$ip:5555/users/email'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token'
          },
          body: jsonEncode({'email': email}),
        );

        final Map<String, dynamic> userInfo = json.decode(userResponse.body);

        if (userInfo['ban'] == true) {
          throw Exception('Tài khoản của bạn đã bị cấm.');
        }

        // Lưu token vào SharedPreferences
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);

        // Cập nhật thông tin người dùng
        _token = token;
        _user = User.fromJson(userInfo);
        _isLoggedIn = true;

        notifyListeners();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      print('Lỗi đăng nhập: $err');
      throw Exception('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
  }

  void logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');

    _token = null;
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }
}
