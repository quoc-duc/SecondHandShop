import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../core/models/regulation_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RegulationProvider with ChangeNotifier {
  List<Regulation> _regulations = [];
  List<Regulation> get regulations => _regulations;

  String? _token;
  String? get token => _token;

  Future<void> fetchRegulations() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    final response = await http.get(
      Uri.parse('http://$ip:5555/regulations/'),
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer $_token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      _regulations =
          data.map((jsonItem) => Regulation.fromJson(jsonItem)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load regulations');
    }
  }
}
