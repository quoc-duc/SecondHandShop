import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config.dart';
import '../../utils/convert.dart';
import '../Product/product_detail.dart';
import '../Checkout/checkout.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  _CartState createState() => _CartState();
}

class _CartState extends State<Cart> {
  late LoginInfo loginInfo;
  List<dynamic> productCart = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchCart(loginInfo.id);
  }

  Future<void> fetchCart(idUser) async {
    final response = await http.get(Uri.parse('http://$ip:5555/carts/$idUser'));

    if (response.statusCode == 200) {
      setState(() {
        productCart = json.decode(response.body);
        isLoading = false;
      });
    } else {
      throw Exception('Failed to load products in cart');
    }
  }

  Future<void> removeFromCart(String idCart) async {
    try {
      final response = await http.delete(Uri.parse('http://$ip:5555/carts/$idCart'));

      if (response.statusCode == 200 || response.statusCode == 204) {
        print('Product removed from cart successfully.');
        await fetchCart(loginInfo.id); // Gọi lại fetchCart để cập nhật giỏ hàng
      } else {
        throw Exception('Failed to remove product from cart: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to remove product from cart: $error');
    }
  }

  Future<Map<String, dynamic>> getProductById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('http://$ip:5555/products/$id'), // Đảm bảo URL là chính xác
      );

      if (response.statusCode == 200) {
        // Giả định rằng dữ liệu đã đúng định dạng
        return json.decode(response.body); // Trả về dữ liệu đã giải mã
      } else {
        throw Exception('Failed to load product with ID: $id'); // Ném ngoại lệ nếu không thành công
      }
    } catch (err) {
      throw Exception('Failed to load product: $err'); // Ném ngoại lệ nếu có lỗi
    }
  }

  String priceOfOne(price, quantity){
    final sum = price * quantity;
    return formatPrice(sum);
  }

  String sumPriceAll(List<dynamic> pros) {
    int sumAll = 0;
    for (var pro in pros) {
      int quantity = pro['product_quantity'] as int; 
      int price = pro['product_price'].toInt();
      sumAll += quantity * price;
    }
    return formatPrice(sumAll);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Giỏ hàng'),
      ),
      body: Stack(
        children: [
          isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(2.0),
              child: ListView.builder(
                itemCount: productCart.length,
                itemBuilder: (context, index) {
                  final product = productCart[index];
                  return Container(
                    child: GestureDetector( // Thêm GestureDetector để nhận sự kiện nhấn
                      onTap: () async {
                        final Map<String, dynamic> pro = await getProductById(product['product_id']);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProductDetail(product: pro),
                          ),
                        );
                      },
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: Row(
                            children: [
                              Container(
                                width: 70,
                                height: 70, // Đặt chiều cao cụ thể cho hình ảnh
                                child: Image.network(
                                  product['product_imageUrl'],
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(width: 10), // Khoảng cách giữa hình ảnh và văn bản
                              Expanded( // Để đảm bảo Column có đủ không gian
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      width: 120, // Đặt chiều rộng cho Container
                                      child: Text(
                                        product['product_name'],
                                        style: TextStyle(fontSize: 14),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        softWrap: false,
                                      ),
                                    ),
                                    Text(
                                      '${formatPrice(product['product_price'])}đ',
                                      style: TextStyle(fontSize: 14),
                                    ),
                                    Text(
                                      'Số lượng: x${product['product_quantity']}',
                                      style: TextStyle(fontSize: 14),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                child: Text(
                                  '${priceOfOne(product['product_price'], product['product_quantity'])}đ',
                                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold,), // Sử dụng TextStyle để thiết lập màu sắc
                                ),
                              ),
                              Container(
                                child: IconButton(
                                  icon: Icon(Icons.delete_outline_outlined),
                                  onPressed: () async {
                                    try {
                                      await removeFromCart(product['_id']); // Chờ xóa sản phẩm
                                    } catch (e) {
                                      // Hiển thị thông báo lỗi nếu có
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Có lỗi khi xóa sản phẩm: $e')),
                                      );
                                    }
                                  },
                                )
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              color: Colors.grey[300], // Màu nền cho nút thanh toán
              padding: EdgeInsets.all(0),
              child: Row(
                children: [
                  Expanded(
                    flex: 6, // Chiếm 60% chiều rộng
                    child: Container(
                      alignment: Alignment.center, // Căn giữa nội dung
                      child: Text(
                        'Tổng: ${sumPriceAll(productCart)}đ',
                        style: TextStyle(color: Colors.red, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 4, // Chiếm 40% chiều rộng
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        fixedSize: Size(double.infinity, 50), // Chiều rộng đầy đủ của thẻ
                        backgroundColor: Colors.red, // Màu nền cho nút
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.zero, // Không bo góc
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => CheckOut(products: productCart))
                        );
                      },
                      child: Text(
                        'Thanh Toán',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}