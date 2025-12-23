import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Screen1 extends StatefulWidget {
  const Screen1({super.key});

  @override
  _Screen1State createState() => _Screen1State();
}

class _Screen1State extends State<Screen1> {
  List<Map<String, dynamic>> products = []; // Danh sách sản phẩm

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    final response = await http.get(Uri.parse('http://192.168.1.76:5555/products/')); // Thay địa chỉ IP của bạn

    if (response.statusCode == 200) {
      final List<dynamic> productJson = json.decode(response.body);
      setState(() {
        products = List<Map<String, dynamic>>.from(productJson);
      });
    } else {
      throw Exception('Failed to load products');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh Sách Sản Phẩm'),
      ),
      body: products.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return ListTile(
                  leading: Image.network(product['image_url'], width: 50, height: 50, fit: BoxFit.cover),
                  title: Text(product['name']),
                  subtitle: Text('${product['price']} VNĐ'), // Hiển thị giá
                );
              },
            ),
    );
  }
}