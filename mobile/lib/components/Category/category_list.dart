import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'category_card.dart';

class CategoryList extends StatefulWidget {
  final String urlBase;

  const CategoryList({
    super.key,
    required this.urlBase,
  });

  @override
  _CategoryListState createState() => _CategoryListState();
}

class _CategoryListState extends State<CategoryList> {
  List<dynamic> categories = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    final response = await http.get(Uri.parse(widget.urlBase));
    
    if (response.statusCode == 200) {
      setState(() {
        categories = json.decode(response.body);
        isLoading = false;
      });
    } else {
      throw Exception('Failed to load categories');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoading 
          ? const Center(child: CircularProgressIndicator()) 
          : Padding(
              padding: const EdgeInsets.all(8.0),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: categories.map((category) {
                    // Kiểm tra dữ liệu trước khi sử dụng
                    if (category['category_name'] != null && category['image_url'] != null) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: SizedBox(
                          width: 100, // Đặt chiều rộng cụ thể nếu cần
                          child: CategoryCard(
                            name: category['category_name'],
                            imageUrl: category['image_url'],
                            id: category['_id'],
                          ),
                        ),
                      );
                    }
                    return SizedBox.shrink(); // Trả về một widget trống nếu không có danh mục
                  }).toList(),
                ),
              ),
            ),
    );
  }
}