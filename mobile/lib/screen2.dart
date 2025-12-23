import 'package:flutter/material.dart';

class Screen2 extends StatelessWidget {
  final String productName;

  const Screen2({super.key, required this.productName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(productName),
      ),
      body: Center(
        child: Text(
          'Chi tiết sản phẩm: $productName',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}