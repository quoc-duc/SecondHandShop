import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Product/product_list.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';
import 'package:intl/intl.dart';

class PurchaseOrderDetail extends StatefulWidget {
  final Map<String, dynamic> order;
  const PurchaseOrderDetail({
    super.key,
    required this.order,
  });

  @override
  _PurchaseOrderDetailState createState() => _PurchaseOrderDetailState();
}

class _PurchaseOrderDetailState extends State<PurchaseOrderDetail> {
  late LoginInfo loginInfo;
  late Map<String, dynamic> ordeR;
  Map<String, dynamic>? orderDetail;
  Map<String, dynamic>? product;

  int _rating = 0;
  final TextEditingController _commentController = TextEditingController();
  final TextEditingController _cancelTextController = TextEditingController(); // Controller cho lý do huỷ

  @override
  void initState() {
    super.initState();
    ordeR = widget.order;
    fetchOderInfo();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  String formatDate1(String dateString) {
    DateTime dateTime = DateTime.parse(dateString); // Chuyển đổi chuỗi thành DateTime
    return DateFormat('dd/MM/yyyy').format(dateTime); // Định dạng lại ngày
  }

  Future<void> fetchOderInfo() async {
    orderDetail = ordeR['orderDetail'];
    product = ordeR['product'];

    // final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${ordeR['_id']}'));
    
    // if (responseOrderDetail.statusCode == 200) {
    //   final resultOrderDetail = json.decode(responseOrderDetail.body);
    //   setState(() {
    //     orderDetail = resultOrderDetail['data'] != null && resultOrderDetail['data'].isNotEmpty
    //         ? resultOrderDetail['data'][0]
    //         : null;
    //   });

    //   if (orderDetail != null) {
    //     final responProduct = await http.get(Uri.parse('http://$ip:5555/products/${orderDetail!['product_id']}'));
    //     if (responProduct.statusCode == 200) {
    //       final resultProduct = json.decode(responProduct.body);
    //       setState(() {
    //         product = resultProduct;
    //       });
    //     } else {
    //       ScaffoldMessenger.of(context).showSnackBar(
    //         SnackBar(content: Text('Không thể tải thông tin sản phẩm!')),
    //       );
    //     }
    //   }
    // } else {
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
    //   );
    // }
  }

  Future<void> handleComment() async {
    Map<String, dynamic> comment = {
      "product_id": product?['_id'],
      "user_id": ordeR['user_id_buyer'],
      "rating": _rating,
      "comment": _commentController.text,
    };
    final responseCommnet = await http.post(Uri.parse('http://$ip:5555/reviews'),
    headers: {
      'Content-Type': 'application/json', // Đặt header cho JSON
    },
    body: jsonEncode(comment),);
    
    if(responseCommnet.statusCode == 201){
      print('Đánh giá thành công');
    }else{
      print('có lỗi');
    }
  }

  void handleCancel() async {
    final cancelReason = _cancelTextController.text;
    if (cancelReason.isNotEmpty) {
      // Gửi yêu cầu huỷ đơn hàng đến server
      Map<String, dynamic> statusOrder = {
        "status_order": 'Request Cancel'
      };
      final responseCancel = await http.put(Uri.parse('http://$ip:5555/orders/${ordeR['_id']}'),
      headers: {
      'Content-Type': 'application/json', // Đặt header cho JSON
    },
    body: jsonEncode(statusOrder),);
    if(responseCancel.statusCode == 200){
      Map<String, dynamic> notification = {
        "user_id_created": ordeR['user_id_buyer'],
        "user_id_receive": ordeR['user_id_seller'],
        "message": 'Đơn hàng ${product?['name']} của ${loginInfo.name} đã muốn huỷ do: $cancelReason.'
      };
      final responseCancel = await http.post(Uri.parse('http://$ip:5555/notifications'),
      headers: {
      'Content-Type': 'application/json', // Đặt header cho JSON
      },
      body: jsonEncode(notification),);
      if(responseCancel.statusCode == 201){
        print('Tạo thông báo thành công');
      }else{
        print('có lỗi tạo thông báo');
      }
      print('Gửi huỷ thành công');
    }else{
      print('có lỗi tạo yêu cầu huỷ');
    }
      _cancelTextController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Yêu cầu huỷ đơn hàng đã được gửi!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng nhập lý do huỷ đơn hàng!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chi tiết đơn mua'),
      ),
      body: product == null 
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: double.infinity,
                      color: Colors.orange,
                      padding: EdgeInsets.all(8.0),
                      child: Center(child: Text('${ordeR['status_order']}', style: TextStyle(fontSize: 18))),
                    ),
                    SizedBox(height: 16),
                    Text('Thông tin sản phẩm', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        product?['image_url'] ?? '',
                        width: double.infinity,
                        height: 220,
                        fit: BoxFit.contain,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text('${product?['name']}'),
                    Text('Đơn giá: ${formatPrice(product?['price'])} x${product?['quantity']}'),
                    Text('Thành tiền: ${formatPrice(ordeR['total_amount'])}'),
                    Text('Ngày tạo đơn: ${formatDate1(ordeR['createdAt'])}'),

                    // Phần đánh giá sản phẩm
                    SizedBox(height: 10),
                    ordeR['status_order'] == 'Success'  || ordeR['status_order'] == 'Received' 
                    ? Column(children: [
                        Text('Đánh giá sản phẩm', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(5, (index) {
                            return IconButton(
                              icon: Icon(
                                index < _rating ? Icons.star : Icons.star_border,
                                color: Colors.amber,
                              ),
                              onPressed: () {
                                setState(() {
                                  _rating = index + 1; // Cập nhật số sao đánh giá
                                });
                              },
                            );
                          }),
                        ),
                        TextField(
                          controller: _commentController,
                          decoration: InputDecoration(
                            labelText: 'Nhập nhận xét',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 1,
                        ),
                        SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {
                            // Xử lý gửi đánh giá
                            print('đơn hàng: $ordeR ======= \n chi tiết: $orderDetail ======= \n sản phẩm: $product');
                            final comment = _commentController.text;
                            if (_rating > 0 && comment.isNotEmpty) {
                              print('Đánh giá: $_rating, Nhận xét: $comment');
                              handleComment();
                              _rating = 0;
                              _commentController.clear();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Cảm ơn bạn đã gửi đánh giá!')),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Vui lòng chọn số sao và nhập nhận xét!')),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white, backgroundColor: Colors.green, // Màu chữ
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8.0), // Bo góc nhẹ
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min, // Để không chiếm quá nhiều không gian
                            children: [
                              Icon(Icons.send, color: Colors.white), // Thêm icon gửi
                              SizedBox(width: 8), // Khoảng cách giữa icon và chữ
                              Text('Gửi đánh giá'),
                            ],
                          ),
                        ),
                      ]) : SizedBox.shrink(),

                    // Phần huỷ đơn hàng
                    (ordeR['status_order'] == 'Pending' || ordeR['status_order'] == 'Confirmed')
                    ? Column(
                        children: [
                          SizedBox(height: 16),
                          Text('Huỷ đơn hàng', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: TextField(
                              controller: _cancelTextController,
                              decoration: InputDecoration(
                                labelText: 'Nguyên nhân muốn huỷ đơn hàng',
                                border: OutlineInputBorder(),
                              ),
                              maxLines: 1,
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              if (_cancelTextController.text.isNotEmpty) {
                                handleCancel();
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Vui lòng nhập nguyên nhân huỷ đơn!')),
                                );
                              }
                              },
                              style: ElevatedButton.styleFrom(
                                foregroundColor: Colors.white, backgroundColor: Colors.red, // Màu chữ
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8.0), // Bo góc nhẹ
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min, // Để không chiếm quá nhiều không gian
                                children: [
                                  Icon(Icons.cancel, color: Colors.white), // Thêm icon
                                  SizedBox(width: 8), // Khoảng cách giữa icon và chữ
                                  Text('Huỷ đơn hàng'),
                                ],
                              ),
                            ),
                        ],
                      )
                    : SizedBox.shrink(),

                    SizedBox(height: 16),
                    Text('Các sản phẩm tương tự', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    Container(
                      height: 400,
                      child: ProductList(
                        urlBase: 'http://$ip:5555/products/category/${product!['category_id']}',
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}