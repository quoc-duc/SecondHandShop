import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../core/models/user_model.dart';
import 'package:path/path.dart' as path;
import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';
import 'dart:io';
import './login_info.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProfileProvider with ChangeNotifier {
  User? _user;
  User? get user => _user;
  String? _token;
  String? get token => _token;

  Future<void> fetchUser(String id) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    final response =
        await http.get(Uri.parse('http://$ip:5555/users/$id'), headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      _user = User.fromJson(data);
      notifyListeners();
    } else {
      print('$token');
      print('Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');
      throw Exception('Failed to load user profile');
    }
  }

  Future<void> updateUser(String id, User updatedUser) async {
    final response = await http.put(
      Uri.parse('http://$ip:5555/users/$id'),
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer $token',
      },
      body: jsonEncode({
        "name": updatedUser.name,
        "username": updatedUser.username,
        "phone": updatedUser.phone,
        "email": updatedUser.email,
        "address": updatedUser.address,
        "avatar_url": updatedUser.avatarUrl,
        "provinceId": updatedUser.provinceId,
        "districtId": updatedUser.districtId,
      }),
    );

    if (response.statusCode == 200) {
      _user = updatedUser;
      notifyListeners();
    } else {
      throw Exception('Failed to update user profile');
    }
  }

  Future<String?> uploadImageToCloudinary(File imageFile) async {
    final cloudName = 'dd6pnq2is';
    final uploadPreset = 'images_preset';
    final url =
        Uri.parse('https://api.cloudinary.com/v1_1/$cloudName/image/upload');

    final mimeType = lookupMimeType(imageFile.path);

    final request = http.MultipartRequest('POST', url)
      ..fields['upload_preset'] = uploadPreset
      ..files.add(await http.MultipartFile.fromPath(
        'file',
        imageFile.path,
        contentType: mimeType != null ? MediaType.parse(mimeType) : null,
      ));

    final response = await request.send();

    if (response.statusCode == 200) {
      final respStr = await response.stream.bytesToString();
      final data = jsonDecode(respStr);
      return data['secure_url']; // Trả về URL ảnh
    } else {
      print('Upload failed: ${response.statusCode}');
      return null;
    }
  }
}
