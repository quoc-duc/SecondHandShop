import 'package:flutter/material.dart';
import '../Product/product_by_category.dart';

class CategoryCard extends StatelessWidget {
  final String imageUrl;
  final String name;
  final String id;

  const CategoryCard({
    super.key,
    required this.imageUrl,
    required this.name,
    required this.id,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Chuyển đến màn hình mới và truyền tên sản phẩm
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductByCategory(id: id, name: name,),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          //color: Colors.green,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
              child: Image.network(
                imageUrl,
                width: double.infinity,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            Container(
              alignment: Alignment.center, // Căn giữa theo chiều dọc và ngang
              color: const Color.fromARGB(78, 233, 210, 210), // Nền trắng mờ cho tên
              width: double.infinity, // Chiếm toàn bộ chiều rộng
              height: 100, // Chiều cao giống với hình
              child: Text(
                name,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.black, // Màu chữ đen
                ),
                textAlign: TextAlign.center, // Căn giữa chữ
              ),
            ),
          ],
        ),
      ),
    );
  }
}