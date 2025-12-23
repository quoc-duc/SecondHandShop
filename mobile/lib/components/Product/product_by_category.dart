import 'package:flutter/material.dart';
import 'product_list.dart';
import '../../config.dart';

class ProductByCategory extends StatefulWidget {
  final String id;
  final String name;

  const ProductByCategory({
    super.key,
    required this.id,
    required this.name,
  });

  @override
  _ProductByCategory createState() => _ProductByCategory();
}

class _ProductByCategory extends State<ProductByCategory> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.name),
      ),
      body: Padding(
        padding: const EdgeInsets.all(5.0),
        child: ProductList(
          urlBase: 'http://$ip:5555/products/category/${widget.id}',
        ),
      ),
    );
  }
}