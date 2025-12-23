import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../core/models/regulation_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/models/feedback_model.dart';

class FeedbackProvider extends ChangeNotifier {
  UserFeedback? _feedback;
  UserFeedback? get feedback => _feedback;
  String? _token;

  String? get token => _token;

  Future<UserFeedback?> postFeedback(UserFeedback feedback) async {
    {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('token');

      final response = await http.post(
        Uri.parse('http://$ip:5555/feedbacks/'),
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer $_token',
        },
        body: jsonEncode({
          "user_id": feedback.userId,
          "email": feedback.email,
          "message": feedback.message,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        _feedback = UserFeedback.fromJson(data);
        notifyListeners();
        return _feedback; // <- return the result
      } else {
        throw Exception('Failed to post feedback');
      }
    }
  }
}
