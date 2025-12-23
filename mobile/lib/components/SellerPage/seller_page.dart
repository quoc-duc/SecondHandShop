import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:mobile/providers/login_info.dart';
import '../../config.dart';
import '../Product/product_list.dart';

class SellerPage extends StatefulWidget {
  final String idSeller;
  const SellerPage({
    super.key,
    required this.idSeller,
  });

  @override
  _SellerPageState createState() => _SellerPageState();
}

class _SellerPageState extends State<SellerPage> {
  late Map<String, dynamic> sellerInfo;
  bool isLoading = true; // Biến trạng thái để kiểm tra việc tải dữ liệu

  @override
  void initState() {
    super.initState();
    fetchSellerInfo();
  }

  Future<void> fetchSellerInfo() async {
    final response = await http.get(Uri.parse('http://$ip:5555/users/${widget.idSeller}'));
    if (response.statusCode == 200) {
      sellerInfo = jsonDecode(response.body);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không tải được thông tin người bán!')),
      );
    }
    setState(() {
      isLoading = false; // Cập nhật trạng thái sau khi tải xong
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Trang người bán"),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) // Hiển thị vòng tròn tải
          : LayoutBuilder(
              builder: (context, constraints) {
                final bodyHeight = constraints.maxHeight; // Chiều cao của body
                return Column(
                  children: [
                    Container(
                      height: bodyHeight * 0.2, // 20% chiều cao body
                      child: Column(
                        children: [
                          Row(
                            children: [
                              ClipOval(
                                child: sellerInfo['avatar_url'] != null
                                    ? Image.network(
                                        sellerInfo['avatar_url'],
                                        width: 70.0,
                                        height: 70.0,
                                        fit: BoxFit.cover,
                                      )
                                    : Container(
                                            width: 70.0,
                                            height: 70.0,
                                            color: Colors.grey, // Màu nền khi lỗi tải hình
                                            child: Icon(Icons.error, color: Colors.white),
                                          )
                              ),
                              SizedBox(width: 10), // Khoảng cách giữa avatar và tên
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(sellerInfo['name'] ?? 'Không có tên'),
                                  Text(sellerInfo['phone'] ?? 'Không có số điện thoại'),
                                  Text(sellerInfo['address'] ?? 'Không có địa chỉ'),
                                ],
                              ),
                            ],
                          ),
                          Center(child: Text("Trang người bán")),
                        ],
                      ),
                    ),
                    Container(
                      height: bodyHeight * 0.8, // 80% chiều cao body
                      child: ProductList(
                        urlBase: 'http://$ip:5555/products/user/${widget.idSeller}',
                      ),
                    ),
                  ],
                );
              },
            ),
    );
  }
}