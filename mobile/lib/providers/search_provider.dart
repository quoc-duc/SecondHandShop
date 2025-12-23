import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchProvider with ChangeNotifier {
  List<dynamic> _results = [];
  List<dynamic> get results => _results;

  Future<void> searchProducts({
    required String key,
    String? brand,
    double? minPrice,
    double? maxPrice,
    String? origin,
    String? condition,
  }) async {
    final queryParams = {
      'name': key,
      if (brand != null && brand.isNotEmpty) 'brand': brand,
      if (minPrice != null) 'minPrice': minPrice.toString(),
      if (maxPrice != null) 'maxPrice': maxPrice.toString(),
      if (origin != null && origin.isNotEmpty) 'origin': origin,
      if (condition != null && condition.isNotEmpty) 'condition': condition,
    };

    final uri =
        Uri.http("localhost:5555", "/products/product/search", queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final responseBody = json.decode(response.body);
      _results = responseBody['data'];
      notifyListeners();
    } else {
      throw Exception('Failed to load search results');
    }
  }

  void clearResults() {
    _results = [];
    notifyListeners();
  }
}
