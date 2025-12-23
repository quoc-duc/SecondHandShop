import 'package:flutter/material.dart';
import '../Product/product_detail.dart'; // Import màn hình mới
import '../../utils/convert.dart';
import 'package:video_player/video_player.dart';

class ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;

  const ProductCard({
    super.key,
    required this.product,
  });

  @override
  Widget build(BuildContext context) {
    // Lấy các thuộc tính từ đối tượng product
    final String name = product['name'];
    final String price =
        "${formatPrice(product['price'])} đ"; // Chuyển giá thành chuỗi với đơn vị
    final String imageUrl = product['image_url'];
    final String videoUrl = product['video_url'];

    return GestureDetector(
      onTap: () {
        // Chuyển đến màn hình mới và truyền tên sản phẩm
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetail(product: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(5),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                child: videoUrl.endsWith('.mp4')
                    ? Center(child: Text("Đây là video")) // Thay thế bằng widget video của bạn
                    : Image.network(
                        imageUrl,
                        width: double.infinity,
                        height: 170,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey, // Màu nền khi có lỗi tải hình
                          );
                        },
                      ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(4.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, // Căn trái
                children: [
                  Align(
                    alignment: Alignment.centerLeft, // Đảm bảo căn trái
                    child: Text(
                      name,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                      maxLines: 1, // Giới hạn số dòng là 1
                      overflow: TextOverflow.ellipsis, // Sử dụng ba chấm khi vượt quá chiều dài
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    price,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                  const SizedBox(height: 4),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
