import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Order/sale_order_detail.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';
import 'package:intl/intl.dart';

class SaleOrder extends StatefulWidget {
  const SaleOrder({super.key});

  @override
  _SaleOrderState createState() => _SaleOrderState();
}

class _SaleOrderState extends State<SaleOrder> with SingleTickerProviderStateMixin {
  late LoginInfo loginInfo;
  late List<dynamic> saleOrder = [];
  late TabController _tabController;

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

  DateTime? startDate;
DateTime? endDate;
String searchTerm = '';
String searchPhone = '';

String formatDate1(String dateString) {
  DateTime dateTime = DateTime.parse(dateString); // Chuyển đổi chuỗi thành DateTime
  return DateFormat('dd/MM/yyyy').format(dateTime); // Định dạng lại ngày
}

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

  Future<void> fetchPurchaseOrders() async {
    if (isLoading) return; // Ngăn tải lại khi đang tải dữ liệu
    isLoading = true;

    final response = await http.get(Uri.parse('http://$ip:5555/orders/seller1/page?page=$currentPage&limit=10&userId=${loginInfo.id}'));
    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      List<dynamic> fetchedSaleOrder = result['data']; // Đổi tên

      for (var order in fetchedSaleOrder) {
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
            }
          }
        }
      }

      setState(() {
        saleOrder.addAll(fetchedSaleOrder); // Cập nhật danh sách
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

  void filterOrders() {
  setState(() {
    saleOrder = saleOrder.where((order) {
      bool matchesName = order['name'].toString().toLowerCase().contains(searchTerm.toLowerCase());
      bool matchesPhone = order['phone'].toString().contains(searchPhone);
      bool matchesDate = true;

      if (startDate != null) {
        matchesDate = DateTime.parse(order['createdAt']).isAfter(startDate!);
      }
      if (endDate != null) {
        matchesDate = matchesDate && DateTime.parse(order['createdAt']).isBefore(endDate!);
      }

      return matchesName && matchesPhone && matchesDate;
    }).toList();
  });
}

String formatDate(DateTime date) {
  return "${date.day}/${date.month}/${date.year}";
}
  List<dynamic> getFilteredOrders(String status) {
    if (status == "All") {
      return saleOrder;
    } else {
      return saleOrder.where((order) => order['status_order'] == status).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('Đơn bán')),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: statuses.map((status) => Tab(text: status)).toList(),
        ),
        actions: [
        IconButton(
          icon: Icon(Icons.search),
          onPressed: () {
            // Mở hộp thoại tìm kiếm hoặc bộ lọc
            showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: Text('Tìm kiếm đơn hàng'),
    content: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            decoration: InputDecoration(labelText: 'Tìm theo tên người mua'),
            onChanged: (value) {
              searchTerm = value;
            },
          ),
          TextField(
            decoration: InputDecoration(labelText: 'Tìm theo số điện thoại'),
            onChanged: (value) {
              searchPhone = value;
            },
          ),
          GestureDetector(
            onTap: () async {
              DateTime? pickedDate = await showDatePicker(
                context: context,
                initialDate: startDate ?? DateTime.now(),
                firstDate: DateTime(2000),
                lastDate: DateTime(2101),
              );
              if (pickedDate != null) {
                setState(() {
                  startDate = pickedDate;
                });
              }
            },
            child: AbsorbPointer( // Ngăn không cho nhập trực tiếp
              child: TextField(
                decoration: InputDecoration(
                  labelText: 'Từ ngày',
                  hintText: startDate != null ? formatDate(startDate!) : 'Chọn ngày',
                ),
                readOnly: true,
              ),
            ),
          ),
          GestureDetector(
            onTap: () async {
              DateTime? pickedDate = await showDatePicker(
                context: context,
                initialDate: endDate ?? DateTime.now(),
                firstDate: DateTime(2000),
                lastDate: DateTime(2101),
              );
              if (pickedDate != null) {
                setState(() {
                  endDate = pickedDate;
                });
              }
            },
            child: AbsorbPointer( // Ngăn không cho nhập trực tiếp
              child: TextField(
                decoration: InputDecoration(
                  labelText: 'Đến ngày',
                  hintText: endDate != null ? formatDate(endDate!) : 'Chọn ngày',
                ),
                readOnly: true,
              ),
            ),
          ),
        ],
      ),
    ),
    actions: [
      
      TextButton(
        onPressed: () {
          Navigator.of(context).pop();
        },
        child: Text('Hủy'),
      ),
      TextButton(
        onPressed: () {
          Navigator.of(context).pop();
          filterOrders();
        },
        child: Text('Lọc'),
      ),
    ],
  ),
);
          },
        ),
      ],
      ),
      body: loginInfo.name == null
          ? Center(child: Text('Hãy đăng nhập để có trải nghiệm tốt nhất'))
          :  TabBarView(
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
                        ? Center(child: Text('Không có đơn hàng nào.'))
                        : ListView.builder(
                            itemCount: filteredOrders.length,
                            itemBuilder: (context, index) {
                              final order = filteredOrders[index];
                              return GestureDetector(
                                onTap: () {
                                  Navigator.push(context,
                                  MaterialPageRoute(builder: (context) => SaleOrderDetail(order: order)));
                                },
                                child: ListTile(
  contentPadding: EdgeInsets.all(2.0), // Thêm khoảng cách
  title: Row(
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
      SizedBox(width: 2), // Khoảng cách giữa hình và thông tin
      Expanded( // Để thông tin chiếm không gian còn lại
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(order['name'] ?? 'Người mua không xác định'),
            // Text(order['_id']),
            Text(order['product']?['name'] ?? 'Tên sản phẩm không xác định'),
            Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}'),
            Text('Ngày tạo đơn: ${formatDate1(order['createdAt'])}'),
            Divider(
  thickness: 2.0, // Độ dày của đường kẻ
  color: Colors.black, // Màu của đường kẻ
),
          ],
        ),
      ),
    ],
  ),
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SaleOrderDetail(order: order)),
    );
  },
)
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