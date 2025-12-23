import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Order/purchase_order_detail.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';
import 'package:intl/intl.dart';

class PurchaseOrder extends StatefulWidget {
  const PurchaseOrder({super.key});

  _PurchaseOrderState createState() => _PurchaseOrderState();
}

class _PurchaseOrderState extends State<PurchaseOrder> with SingleTickerProviderStateMixin {
  late LoginInfo loginInfo;
  late List<dynamic> purchaseOrder = [];
  late TabController _tabController;
  // bool isLoading = true;

  final List<String> statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Packaged",
    "Shipping",
    "Success",
    "Received",
    "Request Cancel",
    "Cancelled",
  ];

  int currentPage = 1; // Biến để theo dõi trang hiện tại
  bool isLoading = false; // Biến để theo dõi trạng thái tải
  bool isLoadingMore = false; // Biến để theo dõi trạng thái tải thêm dữ liệu

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: statuses.length, vsync: this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchPurchaseOrders();
  }

  String formatDate1(String dateString) {
    DateTime dateTime = DateTime.parse(dateString); // Chuyển đổi chuỗi thành DateTime
    return DateFormat('dd/MM/yyyy').format(dateTime); // Định dạng lại ngày
  }

  Future<void> fetchPurchaseOrders() async {
    if (isLoading) return; // Ngăn tải lại khi đang tải dữ liệu
    isLoading = true;

    // final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer/${loginInfo.id}'));
    final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer1/page?page=$currentPage&limit=10&userId=${loginInfo.id}'));
    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      List<dynamic> purchaseOrders = result['data'];

      // Using a for loop to process each purchase order
      for (var order in purchaseOrders) {
        final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${order['_id']}'));

        if (responseOrderDetail.statusCode == 200) {
          final resultOrderDetail = json.decode(responseOrderDetail.body);
          var orderDetail = resultOrderDetail['data'] != null && resultOrderDetail['data'].isNotEmpty
              ? resultOrderDetail['data'][0]
              : null;

          if (orderDetail != null) {
            final responseProduct = await http.get(Uri.parse('http://$ip:5555/products/${orderDetail['product_id']}'));
            if (responseProduct.statusCode == 200) {
              final resultProduct = json.decode(responseProduct.body);
              order['orderDetail'] = orderDetail;
              order['product'] = resultProduct;
              isLoading = false;
            }
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
          );
        }
      }

      // Update the state with the modified purchase orders
      setState(() {
        purchaseOrder.addAll(purchaseOrders);
        currentPage++; // Tăng trang hiện tại
        isLoadingMore = false; // Kết thúc trạng thái tải thêm
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }

    isLoading = false; // Kết thúc trạng thái tải
  }
  // Future<void> fetchPurchaseOrders() async {
  //   final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer/${loginInfo.id}'));
  //   if (response.statusCode == 200) {
  //     final result = json.decode(response.body);
  //     setState(() {
  //       purchaseOrder = result['data'];
  //     });
  //   } else {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
  //     );
  //   }
  // }

  List<dynamic> getFilteredOrders(String status) {
    if (status == "All") {
      return purchaseOrder;
    } else {
      return purchaseOrder.where((order) => order['status_order'] == status).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('Đơn mua')),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: statuses.map((status) => Tab(text: status)).toList(),
        ),
      ),
      body: loginInfo.name == null
          ? Center(child: Text('Hãy đăng nhập để có trải nghiệm tốt nhất'))
          : TabBarView(
        controller: _tabController,
        children: statuses.map((status) {
          final filteredOrders = getFilteredOrders(status);
          return NotificationListener<ScrollNotification>(
            onNotification: (ScrollNotification scrollInfo) {
              if (!isLoading && scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent) {
                isLoadingMore = true; // Bắt đầu tải thêm dữ liệu
                fetchPurchaseOrders(); // Tải thêm dữ liệu khi cuộn đến cuối
              }
              return false;
            },
            child: Container(
              child: Column(
                children: [
                  Expanded(
                    child: filteredOrders.isEmpty 
                    ?Center(child: Text('Không có đơn hàng nào.')) //Center(child: CircularProgressIndicator())
                    : filteredOrders.isEmpty ? 
                    Center(child: Text('Không có đơn hàng nào.'))
                    : ListView.builder(
                        itemCount: filteredOrders.length,
                        itemBuilder: (context, index) {
                          final order = filteredOrders[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(context,
                              MaterialPageRoute(builder: (context) => PurchaseOrderDetail(order: order)));
                              print(order);
                            },
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: order['product'] != null && order['product']['image_url'] != null
                                    ? Image.network(
                                        order['product']['image_url'],
                                        width: 70,
                                        height: 70,
                                        fit: BoxFit.contain,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Container(
                                            width: 70,
                                            height: 70,
                                            color: Colors.grey, // Màu nền khi có lỗi tải hình
                                          );
                                        },
                                      )
                                    : Container(
                                        width: 70,
                                        height: 70,
                                        color: Colors.grey, // Màu nền khi không có URL
                                      ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Text('${order['product']?['name'] ?? 'Tên sản phẩm không xác định'}'),
                                  Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}'),
                                  Text('Ngày tạo đơn: ${formatDate1(order['createdAt'])}'),
                                  Divider(thickness: 2.0, color: Colors.black),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  if (isLoadingMore) // Hiển thị vòng tròn loading khi tải thêm
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Center(child: CircularProgressIndicator()),
                    ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}