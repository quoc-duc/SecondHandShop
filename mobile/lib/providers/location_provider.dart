import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LocationProvider with ChangeNotifier {
  List<Province> _provinces = [];
  List<District> _districts = [];

  List<Province> get provinces => _provinces;
  List<District> get districts => _districts;

  Future<void> fetchProvinces() async {
    final response = await http.get(
      Uri.parse(
          'https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      _provinces = (data['data'] as List)
          .map((item) => Province.fromJson(item))
          .toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load provinces');
    }
  }

  Future<void> fetchDistricts(String provinceId) async {
    final response = await http.get(
      Uri.parse(
          'https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=$provinceId'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      _districts = (data['data'] as List)
          .map((item) => District.fromJson(item))
          .toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load districts');
    }
  }
}

class Province {
  final int id;
  final String code;
  final String name;

  Province({required this.id, required this.code, required this.name});

  factory Province.fromJson(Map<String, dynamic> json) {
    return Province(
      id: json['PROVINCE_ID'],
      code: json['PROVINCE_CODE'],
      name: json['PROVINCE_NAME'],
    );
  }
}

class District {
  final int id;
  final String value;
  final String name;
  final int provinceId;

  District(
      {required this.id,
      required this.value,
      required this.name,
      required this.provinceId});

  factory District.fromJson(Map<String, dynamic> json) {
    return District(
      id: json['DISTRICT_ID'],
      value: json['DISTRICT_VALUE'],
      name: json['DISTRICT_NAME'],
      provinceId: json['PROVINCE_ID'],
    );
  }
}
