import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';
import './sale_order.dart';
import 'package:intl/intl.dart';

class SaleOrderDetail extends StatefulWidget {
  final Map<String, dynamic> order;
  const SaleOrderDetail({
    super.key,
    required this.order,
  });

  @override
  _SaleOrderDetailState createState() => _SaleOrderDetailState();
}

class _SaleOrderDetailState extends State<SaleOrderDetail> {
  late LoginInfo loginInfo;
  late Map<String, dynamic> ordeR;
  Map<String, dynamic>? orderDetail; // Đổi thành nullable
  Map<String, dynamic>? product;

   final TextEditingController _cancelTextController = TextEditingController();

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

  Future<void> fetchOderInfo() async {
    final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${ordeR['_id']}'));
    
    if (responseOrderDetail.statusCode == 200) {
      final resultOrderDetail = json.decode(responseOrderDetail.body);
      setState(() {
        // Gán giá trị của thuộc tính 'data' vào orderDetail
        orderDetail = resultOrderDetail['data'] != null && resultOrderDetail['data'].isNotEmpty
            ? resultOrderDetail['data'][0] // Lấy phần tử đầu tiên trong danh sách
            : null; // Nếu không có dữ liệu, gán null
      });

      if (orderDetail != null) {
        final responProduct = await http.get(Uri.parse('http://$ip:5555/products/${orderDetail!['product_id']}'));
        if (responProduct.statusCode == 200) {
          final resultProduct = json.decode(responProduct.body); // Lấy body để giải mã
          setState(() {
            product = resultProduct;
          });
        } else {
          // Xử lý trường hợp không lấy được sản phẩm
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Không thể tải thông tin sản phẩm!')),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }
  }

  String formatDate1(String dateString) {
  DateTime dateTime = DateTime.parse(dateString); // Chuyển đổi chuỗi thành DateTime
  return DateFormat('dd/MM/yyyy').format(dateTime); // Định dạng lại ngày
}

  void handleCancel() async {
    final cancelReason = _cancelTextController.text;
    if (cancelReason.isNotEmpty) {
      // Gửi yêu cầu huỷ đơn hàng đến server
      Map<String, dynamic> statusOrder = {
        "status_order": 'Cancelled'
      };
      final responseCancel = await http.put(Uri.parse('http://$ip:5555/orders/${ordeR['_id']}'),
      headers: {
      'Content-Type': 'application/json', // Đặt header cho JSON
    },
    body: jsonEncode(statusOrder),);
    if(responseCancel.statusCode == 200){
      Map<String, dynamic> notification = {
        "user_id_created": ordeR['user_id_seller'],
        "user_id_receive": ordeR['user_id_buyer'],
        "message": 'Đơn hàng ${product?['name']} của bạn đã bị huỷ do: $cancelReason.'
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
        SnackBar(content: Text('Huỷ đơn hàng đã được gửi!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng nhập lý do huỷ đơn hàng!')),
      );
    }
  }

  void handleChangeStatusOrder() async {
    Map<String, dynamic> statusOrder = {
      "status_order": ordeR['status_order'] == "Pending" ? "Confirmed" :
      ordeR['status_order'] == "Confirmed" ? "Packaged" :
      ordeR['status_order'] == "Packaged" ? "Shipping" : 
      ordeR['status_order'] == "Request Cancel" ? "Cancelled" : "Success"
    };
    final responseCancel = await http.put(Uri.parse('http://$ip:5555/orders/${ordeR['_id']}'),
    headers: {'Content-Type': 'application/json',},
    body: jsonEncode(statusOrder),);
    if(responseCancel.statusCode == 200){
      Map<String, dynamic> notification = {
        "user_id_created": ordeR['user_id_seller'],
        "user_id_receive": ordeR['user_id_buyer'],
        "message": 'Đơn hàng ${product?['name']} của bạn ${ordeR['status_order'] == "Pending" ? "đã được xác nhận và chờ đóng gói." :
      ordeR['status_order'] == "Confirmed" ? "được đóng gói và chờ gửi đến bộ phận vận chuyển." :
      ordeR['status_order'] == "Packaged" ? "đang trên đường vận chuyển đến bạn." :
      ordeR['status_order'] == "Request Cancel" ? "đã được xác nhận huỷ." : "đã được giao thành công."}.'
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
      print('Gửi chuyển trạng thái thành công');
    }else{
      print('có lỗi chuyển trạng thái đơn hàng.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: loginInfo.id == ordeR['user_id_seller'] 
            ? Text('Chi tiết đơn bán') 
            : Text('Chi tiết đơn mua'),
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
                    Container(
                      height: 60,
                      child: GestureDetector(
                        onTap: () {
                          // Xử lý khi nhấn vào
                        },
                        child: Card(
                          color: Colors.amber,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Icon(Icons.map),
                              SizedBox(width: 8), 
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text('${ordeR['name']}  ${ordeR['phone']}'),
                                  Text(ordeR['address']),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
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
                    
                    // ElevatedButton(
                    //   onPressed: () {
                    //     print('đơn hàng: $ordeR ======= \n chi tiết: $orderDetail ======= \n sản phẩm: $product');
                    //   },
                    //   child: Text('Xem trước khi lưu'),
                    // ),

                    SizedBox(height: 16),
                    (ordeR['status_order'] == 'Success' || ordeR['status_order'] == 'Request Cancel'
                    || ordeR['status_order'] == 'Cancelled') ?
                    SizedBox.shrink()
                    : ElevatedButton(
                        onPressed: () {
                          handleChangeStatusOrder();
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
                            Icon(Icons.check, color: Colors.white), // Thêm icon
                            SizedBox(width: 8), // Khoảng cách giữa icon và chữ
                            Text('Xác nhận đơn hàng'),
                          ],
                        ),
                      ),
                    SizedBox(height: 6),
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
                    : ordeR['status_order'] == 'Request Cancel' ?
                    ElevatedButton(
                      onPressed: (){
                        handleChangeStatusOrder();
                      },
                      child: Text('Xác nhận huỷ'),
                    )
                    : SizedBox.shrink(),
                  ],
                ),
              ),
            ),
    );
  }
}