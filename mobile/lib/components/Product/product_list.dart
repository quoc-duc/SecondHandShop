import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Để chuyển đổi JSON
import '../UI/product_card.dart';

class ProductList extends StatefulWidget {
  final String urlBase;
  const ProductList({
    super.key,
    required this.urlBase,
  });

  @override
  _ProductListState createState() => _ProductListState();
}

class _ProductListState extends State<ProductList> {
  List<dynamic> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    setState(() {
      isLoading = true; // Bắt đầu quá trình tải
    });

    // Tạo một Future cho việc tải dữ liệu và khoảng thời gian chờ
    final response = await Future.wait([
      http.get(Uri.parse(widget.urlBase)),
      Future.delayed(Duration(seconds: 2)), // Khoảng thời gian chờ 3 giây
    ]);

    // Kiểm tra phản hồi từ API
    if (response[0].statusCode == 200) {
      setState(() {
        products = json.decode(response[0].body);
        isLoading = false; // Dữ liệu đã được tải thành công
      });
    } else {
      setState(() {
        isLoading = false; // Không có dữ liệu hoặc có lỗi
      });
      throw Exception('Failed to load products');
    }
  }
  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (products.isEmpty) {
      return const Center(child: Text('Không có sản phẩm cho trang này.'));
    } else {
      return Padding(
        padding: const EdgeInsets.all(4.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.8,
            crossAxisSpacing: 4,
            mainAxisSpacing: 4,
          ),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return ProductCard(
              product: product, // Truyền toàn bộ đối tượng sản phẩm
            );
          },
        ),
      );
    }
  }
}
