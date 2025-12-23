// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:mobile/utils/convert.dart';
// import 'package:mobile/providers/login_info.dart';
// import 'package:provider/provider.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// import '../../config.dart';
// import 'payment_info.dart';
// import '../Home/main_screen.dart';
// import '../../providers/location_provider.dart';

// class CheckOut extends StatefulWidget {
//   final List<dynamic> products;
//   const CheckOut({
//     super.key,
//     required this.products,
//   });

//   @override
//   _CheckOutState createState() => _CheckOutState();
// }

// class _CheckOutState extends State<CheckOut> {
//   late LoginInfo loginInfo;
//   late LocationProvider locationProvider;
//   late List<dynamic> productCart;
//   late List<TextEditingController>
//       noteControllers; // Danh sách controller cho lời nhắn

//   final TextEditingController fullName = TextEditingController();
//   final TextEditingController phoneNumber = TextEditingController();
//   final TextEditingController address = TextEditingController();
//   final TextEditingController email = TextEditingController();
//   String? _paymentMethod;
//   String? provinceName; // Lưu tên tỉnh
//   String? districtName;
//   String? selectedProvinceId;
//   String? selectedDistrictId;

//   @override
//   void initState() {
//     super.initState();
//     productCart = widget.products; // Khởi tạo productCart
//     loginInfo = Provider.of<LoginInfo>(context, listen: false);
//     locationProvider = Provider.of<LocationProvider>(context, listen: false);

//     // Chỉ khởi tạo noteControllers nếu productCart không rỗng
//     if (productCart.isNotEmpty) {
//       noteControllers =
//           List.generate(productCart.length, (index) => TextEditingController());
//     } else {
//       noteControllers = []; // Hoặc khởi tạo với một danh sách trống
//     }

//     if (loginInfo.name != null) {
//       fullName.text = loginInfo.name!;
//       phoneNumber.text = loginInfo.phone!;
//       address.text = loginInfo.address!;
//       email.text = loginInfo.email!;
//       selectedProvinceId = loginInfo.provinceId;
//       selectedDistrictId = loginInfo.districtId;
//     }
//     fetchLocationData();
//   }

//   Future<void> fetchLocationData() async {
//     try {
//       // Lấy danh sách tỉnh
//       await locationProvider.fetchProvinces();
//       if (loginInfo.provinceId != null) {
//         final province = locationProvider.provinces.firstWhere(
//           (p) => p.id.toString() == loginInfo.provinceId,
//           orElse: () => Province(id: -1, code: '', name: 'Không tìm thấy tỉnh'),
//         );
//         setState(() {
//           provinceName = province.name;
//         });

//         // Lấy danh sách quận dựa trên provinceId
//         await locationProvider.fetchDistricts(loginInfo.provinceId!);
//         if (loginInfo.districtId != null) {
//           final district = locationProvider.districts.firstWhere(
//             (d) => d.id.toString() == loginInfo.districtId,
//             orElse: () => District(
//                 id: -1, value: '', name: 'Không tìm thấy quận', provinceId: -1),
//           );
//           setState(() {
//             districtName = district.name;
//           });
//         }
//       }
//     } catch (e) {
//       print('Lỗi khi lấy dữ liệu địa điểm: $e');
//       setState(() {
//         provinceName = 'Lỗi khi tải tỉnh';
//         districtName = 'Lỗi khi tải quận';
//       });
//     }
//   }

//   Future<void> onProvinceChanged(String? provinceId) async {
//     if (provinceId != null) {
//       setState(() {
//         selectedProvinceId = provinceId;
//         provinceName = locationProvider.provinces
//             .firstWhere((p) => p.id.toString() == provinceId)
//             .name;
//         selectedDistrictId = null; // Reset quận/huyện
//         districtName = null;
//       });
//       await locationProvider.fetchDistricts(provinceId);
//       setState(() {
//         districtName = null; // Đặt lại tên quận/huyện
//       });
//     }
//   }

//   // Hàm để cập nhật quận/huyện
//   void onDistrictChanged(String? districtId) {
//     if (districtId != null) {
//       setState(() {
//         selectedDistrictId = districtId;
//         districtName = locationProvider.districts
//             .firstWhere((d) => d.id.toString() == districtId)
//             .name;
//       });
//     }
//   }

//   List<Map<String, dynamic>> createUpdatedProductList() {
//     return List<Map<String, dynamic>>.generate(productCart.length, (index) {
//       return {
//         ...productCart[index], // Lấy dữ liệu từ sản phẩm hiện tại
//         'note': noteControllers[index].text, // Thêm thuộc tính note
//       };
//     });
//   }

//   String sumPriceAll(List<dynamic> pros) {
//     int sumAll = 0;
//     for (var pro in pros) {
//       int quantity = pro['product_quantity'] as int;
//       int price = pro['product_price'].toInt();
//       sumAll += quantity * price;
//     }
//     return formatPrice(sumAll);
//   }

//   String priceOfOne(price, quantity) {
//     final sum = price * quantity;
//     return formatPrice(sum);
//   }

//   Future<dynamic> updateProduct(
//       {required String id, required int quantity}) async {
//     final String url =
//         'http://$ip:5555/products/quanlity'; // Thay <IP> bằng địa chỉ IP thực tế
//     try {
//       final response = await http.put(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode({
//           'id': id,
//           'quanlity': quantity,
//         }),
//       );

//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to update product');
//       }
//     } catch (error) {
//       print('Error updating product: $error');
//       throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
//     }
//   }

//   Future<dynamic> createOrder(Map<String, dynamic> info) async {
//     final String url =
//         'http://$ip:5555/orders'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order');
//       }
//     } catch (error) {
//       print('Error creating order: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<dynamic> createOrderDetail(Map<String, dynamic> info) async {
//     final String url =
//         'http://$ip:5555/orderdetails'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order detail');
//       }
//     } catch (error) {
//       print('Error creating order detail: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<dynamic> createNotification(Map<String, dynamic> notification) async {
//     final String url =
//         'http://$ip:5555/notifications'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(
//             notification), // Chuyển đổi thông báo sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create notification');
//       }
//     } catch (error) {
//       print('Error creating notification: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<void> removeFromCart(String id) async {
//     final String url =
//         'http://$ip:5555/carts/$id'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.delete(Uri.parse(url));

//       if (response.statusCode != 204) {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to remove item from cart');
//       }
//     } catch (error) {
//       print('Error removing item from cart: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<void> handleCheckout() async {
//     List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
//     if (fullName.text.isEmpty ||
//         phoneNumber.text.isEmpty ||
//         address.text.isEmpty) {
//       print(
//           "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ.");
//       return; // Dừng thực hiện nếu có trường không hợp lệ
//     }

//     final phonePattern = RegExp(r'^0\d{9}$');
//     if (!phonePattern.hasMatch(phoneNumber.text)) {
//       print("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
//       return; // Dừng thực hiện nếu số điện thoại không hợp lệ
//     }
//     if (selectedProvinceId == null || selectedDistrictId == null) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Vui lòng chọn tỉnh/thành phố và quận/huyện.')),
//       );
//       return;
//     }

//     if (productCart.isEmpty) {
//       print(
//           "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
//       return; // Dừng thực hiện nếu giỏ hàng trống
//     }

//     for (int index = 0; index < updatedProducts.length; index++) {
//       var product = updatedProducts[index];

//       if (product['user_seller'] == null ||
//           product['product_price'] == null ||
//           product['product_quantity'] == null ||
//           product.isEmpty) {
//         print("Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.");
//         return; // Dừng thực hiện nếu thông tin sản phẩm không hợp lệ
//       }

//       int quantity = -product['product_quantity'];
//       String id = product['product_id'];
//       final resultquanli = await updateProduct(id: id, quantity: quantity);

//       if (resultquanli['quantity'] < 0 ||
//           resultquanli['status'] == false ||
//           resultquanli['approve'] == false) {
//         print(
//             "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác.");
//         try {
//           int qua = product['product_quantity'];
//           final result = await updateProduct(id: id, quantity: qua);
//           print('Product updated successfully: $result');
//           return;
//         } catch (e) {
//           print('Failed to update product: $e');
//         }
//       }

//       var order = await createOrder({
//         'user_id_buyer': product['user_buyer'],
//         'user_id_seller': product['user_seller'],
//         'name': fullName.text, // Sử dụng fullName.text
//         'phone': phoneNumber.text, // Sử dụng phoneNumber.text
//         'provinceId': selectedProvinceId,
//         'districtId': selectedDistrictId,
//         'address': address.text, // Sử dụng address.text
//         'total_amount':
//             product['product_price'] * product['product_quantity'], // Tổng tiền
//         'note': product['note'],
//       });

//       await createOrderDetail({
//         'order_id': order['data']['_id'],
//         'product_id': product['product_id'],
//         'quantity': product['product_quantity'],
//         'price': product['product_price'],
//       });

//       if (loginInfo.name != null) {
//         await createNotification({
//           'user_id_created': loginInfo.id,
//           'user_id_receive': loginInfo.id,
//           'message':
//               'Bạn đã đặt thành công đơn hàng ${product['product_name']}: ${order['data']['total_amount']} VNĐ.',
//         });
//       }

//       await createNotification({
//         'user_id_created': loginInfo.id,
//         'user_id_receive': product['user_seller'],
//         'message':
//             'Có đơn hàng ${product['product_name']} của ${order['data']['name']} số điện thoại ${order['data']['phone']} đang chờ bạn xác nhận.',
//       });

//       if (product['_id'] != null) {
//         String idpro = product['_id'];
//         print(idpro);
//         await removeFromCart(idpro);
//       }
//     }

//     if (_paymentMethod == 'onlinepay') {
//       Navigator.push(
//         context,
//         MaterialPageRoute(
//             builder: (context) => PaymentInfo(products: productCart)),
//       );
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Hãy thanh toán khi nhận hàng.')),
//       );
//       Navigator.push(
//         context,
//         MaterialPageRoute(builder: (context) => MainScreen()),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Đặt hàng"),
//       ),
//       body: Column(
//         children: [
//           Expanded(
//             child: SingleChildScrollView(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Padding(
//                     padding: const EdgeInsets.all(4.0),
//                     child: Text(
//                       'Thông tin đơn hàng',
//                       style:
//                           TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                   Container(
//                       height: 90,
//                       // color: Colors.red,
//                       child: GestureDetector(
//                         onTap: () {
//                           List<Map<String, dynamic>> updatedProducts =
//                               createUpdatedProductList();
//                           print(updatedProducts);
//                         },
//                         child: Card(
//                           color: Colors.amber,
//                           child: Row(
//                             mainAxisAlignment: MainAxisAlignment.start,
//                             children: [
//                               Icon(Icons.map),
//                               Column(
//                                 crossAxisAlignment:
//                                     CrossAxisAlignment.start, // Căn lề trái
//                                 mainAxisAlignment: MainAxisAlignment.center,
//                                 children: [
//                                   Row(
//                                     children: [
//                                       Text(
//                                           '${fullName.text}  ${phoneNumber.text}')
//                                     ],
//                                   ),
//                                   Text(address.text),
//                                   Text(
//                                       'Tỉnh/Thành: $provinceName'), // Hiển thị tên tỉnh
//                                   Text('Quận/Huyện: $districtName'),
//                                 ],
//                               ),
//                             ],
//                           ),
//                         ),
//                       )),
//                   Padding(
//                     padding: const EdgeInsets.all(8.0),
//                     child: Column(
//                       children: [
//                         TextField(
//                           controller: fullName,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập họ tên (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: phoneNumber,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập số điện thoại (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         DropdownButtonFormField<String>(
//                           value: selectedProvinceId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.provinces
//                               .map((Province province) {
//                             return DropdownMenuItem<String>(
//                               value: province.id.toString(),
//                               child: Text(province.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onProvinceChanged(value),
//                           hint: Text('Chọn tỉnh/thành phố'),
//                         ),
//                         SizedBox(height: 4.0),
//                         // Dropdown cho quận/huyện
//                         DropdownButtonFormField<String>(
//                           value: selectedDistrictId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.districts
//                               .map((District district) {
//                             return DropdownMenuItem<String>(
//                               value: district.id.toString(),
//                               child: Text(district.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onDistrictChanged(value),
//                           hint: Text('Chọn quận/huyện'),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: address,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập địa chỉ (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: email,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập email',
//                           ),
//                         ),
//                         SizedBox(height: 20.0), // Khoảng cách giữa các phần
//                         Text('Chọn phương thức thanh toán:'),
//                         CupertinoSegmentedControl<String>(
//                           children: {
//                             'onlinepay': Text('Thanh toán online'),
//                             'cash': Text('Thanh toán khi nhận hàng'),
//                           },
//                           onValueChanged: (String value) {
//                             setState(() {
//                               _paymentMethod = value; // Cập nhật lựa chọn
//                             });
//                           },
//                           groupValue: _paymentMethod,
//                         ),
//                         SizedBox(height: 10.0),
//                         Text(
//                           'Phương thức thanh toán đã chọn: ${_paymentMethod ?? "Chưa chọn"}',
//                           style: TextStyle(fontSize: 16),
//                         ),
//                       ],
//                     ),
//                   ),
//                   ListView.builder(
//                     shrinkWrap:
//                         true, // Cho phép ListView nhỏ lại theo kích thước của nội dung
//                     physics:
//                         NeverScrollableScrollPhysics(), // Ngăn cuộn của ListView
//                     itemCount: productCart.length,
//                     itemBuilder: (context, index) {
//                       return Card(
//                         child: Padding(
//                           padding: const EdgeInsets.all(4.0),
//                           child: Column(children: [
//                             Row(
//                               children: [
//                                 Container(
//                                   width: 70,
//                                   height:
//                                       70, // Đặt chiều cao cụ thể cho hình ảnh
//                                   child: Image.network(
//                                     productCart[index]['product_imageUrl'],
//                                     fit: BoxFit.cover,
//                                   ),
//                                 ),
//                                 SizedBox(
//                                     width:
//                                         10), // Khoảng cách giữa hình ảnh và văn bản
//                                 Expanded(
//                                   // Để đảm bảo Column có đủ không gian
//                                   child: Column(
//                                     crossAxisAlignment:
//                                         CrossAxisAlignment.start,
//                                     children: [
//                                       Container(
//                                         width:
//                                             120, // Đặt chiều rộng cho Container
//                                         child: Text(
//                                           productCart[index]['product_name'],
//                                           style: TextStyle(fontSize: 14),
//                                           maxLines: 1,
//                                           overflow: TextOverflow.ellipsis,
//                                           softWrap: false,
//                                         ),
//                                       ),
//                                       Text(
//                                         '${formatPrice(productCart[index]['product_price'])}đ',
//                                         style: TextStyle(fontSize: 14),
//                                       ),
//                                       Text(
//                                         'Số lượng: x${productCart[index]['product_quantity']}',
//                                         style: TextStyle(fontSize: 14),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//                                 Container(
//                                   child: Text(
//                                     '${priceOfOne(productCart[index]['product_price'], productCart[index]['product_quantity'])}đ',
//                                     style: TextStyle(
//                                       color: Colors.red,
//                                       fontWeight: FontWeight.bold,
//                                     ), // Sử dụng TextStyle để thiết lập màu sắc
//                                   ),
//                                 ),
//                               ],
//                             ),
//                             TextField(
//                               controller: noteControllers[index],
//                               decoration: const InputDecoration(
//                                 border: OutlineInputBorder(),
//                                 hintText: 'Lời nhắn cho người bán',
//                               ),
//                             )
//                           ]),
//                         ),
//                       );
//                     },
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           Container(
//             color: Colors.grey[300],
//             padding: EdgeInsets.all(0),
//             child: Row(
//               children: [
//                 Expanded(
//                   flex: 6,
//                   child: Container(
//                     alignment: Alignment.center,
//                     child: Text(
//                       'Tổng: ${sumPriceAll(productCart)}đ',
//                       style: TextStyle(
//                           color: Colors.red,
//                           fontSize: 18,
//                           fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                 ),
//                 Expanded(
//                   flex: 4,
//                   child: ElevatedButton(
//                     style: ElevatedButton.styleFrom(
//                       fixedSize: Size(double.infinity, 50),
//                       backgroundColor: Colors.red,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.zero,
//                       ),
//                     ),
//                     onPressed: () {
//                       // print('$productCart');
//                       // List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
//                       // print('$updatedProducts');
//                       handleCheckout();
//                     },
//                     child: Text(
//                       'Thanh Toán',
//                       style: TextStyle(color: Colors.white, fontSize: 18),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:mobile/utils/convert.dart';
// import 'package:mobile/providers/login_info.dart';
// import 'package:provider/provider.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// import '../../config.dart';
// import 'payment_info.dart';
// import '../Home/main_screen.dart';
// import '../../providers/location_provider.dart';

// class CheckOut extends StatefulWidget {
//   final List<dynamic> products;
//   const CheckOut({
//     super.key,
//     required this.products,
//   });

//   @override
//   _CheckOutState createState() => _CheckOutState();
// }

// class _CheckOutState extends State<CheckOut> {
//   late LoginInfo loginInfo;
//   late LocationProvider locationProvider;
//   late List<dynamic> productCart;
//   late List<TextEditingController> noteControllers;
//   late Map<String, List<dynamic>> groupedProducts;

//   final TextEditingController fullName = TextEditingController();
//   final TextEditingController phoneNumber = TextEditingController();
//   final TextEditingController address = TextEditingController();
//   final TextEditingController email = TextEditingController();
//   String? _paymentMethod;
//   String? provinceName; // Lưu tên tỉnh
//   String? districtName;
//   String? selectedProvinceId;
//   String? selectedDistrictId;

//   @override
//   void initState() {
//     super.initState();
//     productCart = widget.products; // Khởi tạo productCart
//     loginInfo = Provider.of<LoginInfo>(context, listen: false);
//     locationProvider = Provider.of<LocationProvider>(context, listen: false);
//     groupedProducts = groupProductsBySeller(productCart);

//     // Chỉ khởi tạo noteControllers nếu productCart không rỗng
//     if (productCart.isNotEmpty) {
//       noteControllers =
//           List.generate(productCart.length, (index) => TextEditingController());
//     } else {
//       noteControllers = []; // Hoặc khởi tạo với một danh sách trống
//     }

//     if (loginInfo.name != null) {
//       fullName.text = loginInfo.name!;
//       phoneNumber.text = loginInfo.phone!;
//       address.text = loginInfo.address!;
//       email.text = loginInfo.email!;
//       selectedProvinceId = loginInfo.provinceId;
//       selectedDistrictId = loginInfo.districtId;
//     }
//     fetchLocationData();
//   }

//   Map<String, List<dynamic>> groupProductsBySeller(List<dynamic> products) {
//     Map<String, List<dynamic>> groupedProducts = {};
//     for (var product in products) {
//       String sellerId = product['user_seller'].toString();
//       if (!groupedProducts.containsKey(sellerId)) {
//         groupedProducts[sellerId] = [];
//       }
//       groupedProducts[sellerId]!.add(product);
//     }
//     return groupedProducts;
//   }

//   Future<void> fetchLocationData() async {
//     try {
//       // Lấy danh sách tỉnh
//       await locationProvider.fetchProvinces();
//       if (loginInfo.provinceId != null) {
//         final province = locationProvider.provinces.firstWhere(
//           (p) => p.id.toString() == loginInfo.provinceId,
//           orElse: () => Province(id: -1, code: '', name: 'Không tìm thấy tỉnh'),
//         );
//         setState(() {
//           provinceName = province.name;
//         });

//         // Lấy danh sách quận dựa trên provinceId
//         await locationProvider.fetchDistricts(loginInfo.provinceId!);
//         if (loginInfo.districtId != null) {
//           final district = locationProvider.districts.firstWhere(
//             (d) => d.id.toString() == loginInfo.districtId,
//             orElse: () => District(
//                 id: -1, value: '', name: 'Không tìm thấy quận', provinceId: -1),
//           );
//           setState(() {
//             districtName = district.name;
//           });
//         }
//       }
//     } catch (e) {
//       print('Lỗi khi lấy dữ liệu địa điểm: $e');
//       setState(() {
//         provinceName = 'Lỗi khi tải tỉnh';
//         districtName = 'Lỗi khi tải quận';
//       });
//     }
//   }

//   Future<String> fetchSellerName(String sellerId) async {
//     final String url = 'http://$ip:5555/users/$sellerId';
//     try {
//       final response = await http.get(Uri.parse(url));
//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         return data['name'] ?? 'Người bán không xác định';
//       } else {
//         return 'Lỗi khi tải tên người bán';
//       }
//     } catch (e) {
//       print('Error fetching seller name: $e');
//       return 'Lỗi khi tải tên người bán';
//     }
//   }

//   Future<void> onProvinceChanged(String? provinceId) async {
//     if (provinceId != null) {
//       setState(() {
//         selectedProvinceId = provinceId;
//         provinceName = locationProvider.provinces
//             .firstWhere((p) => p.id.toString() == provinceId)
//             .name;
//         selectedDistrictId = null; // Reset quận/huyện
//         districtName = null;
//       });
//       await locationProvider.fetchDistricts(provinceId);
//       setState(() {
//         districtName = null; // Đặt lại tên quận/huyện
//       });
//     }
//   }

//   // Hàm để cập nhật quận/huyện
//   void onDistrictChanged(String? districtId) {
//     if (districtId != null) {
//       setState(() {
//         selectedDistrictId = districtId;
//         districtName = locationProvider.districts
//             .firstWhere((d) => d.id.toString() == districtId)
//             .name;
//       });
//     }
//   }

//   List<Map<String, dynamic>> createUpdatedProductList() {
//     return List<Map<String, dynamic>>.generate(productCart.length, (index) {
//       return {
//         ...productCart[index], // Lấy dữ liệu từ sản phẩm hiện tại
//         'note': noteControllers[index].text, // Thêm thuộc tính note
//       };
//     });
//   }

//   String sumPriceAll(List<dynamic> pros) {
//     int sumAll = 0;
//     for (var pro in pros) {
//       int quantity = pro['product_quantity'] as int;
//       int price = pro['product_price'].toInt();
//       sumAll += quantity * price;
//     }
//     return formatPrice(sumAll);
//   }

//   String priceOfOne(price, quantity) {
//     final sum = price * quantity;
//     return formatPrice(sum);
//   }

//   Future<dynamic> updateProduct(
//       {required String id, required int quantity}) async {
//     final String url =
//         'http://$ip:5555/products/quanlity'; // Thay <IP> bằng địa chỉ IP thực tế
//     try {
//       final response = await http.put(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode({
//           'id': id,
//           'quanlity': quantity,
//         }),
//       );

//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to update product');
//       }
//     } catch (error) {
//       print('Error updating product: $error');
//       throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
//     }
//   }

//   Future<dynamic> createOrder(Map<String, dynamic> info) async {
//     final String url =
//         'http://$ip:5555/orders'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order');
//       }
//     } catch (error) {
//       print('Error creating order: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<dynamic> createOrderDetail(Map<String, dynamic> info) async {
//     final String url =
//         'http://$ip:5555/orderdetails'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order detail');
//       }
//     } catch (error) {
//       print('Error creating order detail: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<dynamic> createNotification(Map<String, dynamic> notification) async {
//     final String url =
//         'http://$ip:5555/notifications'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode(
//             notification), // Chuyển đổi thông báo sang định dạng JSON
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         // Nếu yêu cầu thành công, trả về dữ liệu
//         final data = jsonDecode(response.body);
//         return data;
//       } else {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create notification');
//       }
//     } catch (error) {
//       print('Error creating notification: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<void> removeFromCart(String id) async {
//     final String url =
//         'http://$ip:5555/carts/$id'; // Thay IP bằng địa chỉ IP thực tế

//     try {
//       final response = await http.delete(Uri.parse(url));

//       if (response.statusCode != 204) {
//         // Nếu có lỗi từ server
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to remove item from cart');
//       }
//     } catch (error) {
//       print('Error removing item from cart: $error');
//       throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
//     }
//   }

//   Future<void> handleCheckout() async {
//     List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
//     if (fullName.text.isEmpty ||
//         phoneNumber.text.isEmpty ||
//         address.text.isEmpty) {
//       print(
//           "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ.");
//       return; // Dừng thực hiện nếu có trường không hợp lệ
//     }

//     final phonePattern = RegExp(r'^0\d{9}$');
//     if (!phonePattern.hasMatch(phoneNumber.text)) {
//       print("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
//       return; // Dừng thực hiện nếu số điện thoại không hợp lệ
//     }
//     if (selectedProvinceId == null || selectedDistrictId == null) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Vui lòng chọn tỉnh/thành phố và quận/huyện.')),
//       );
//       return;
//     }

//     if (productCart.isEmpty) {
//       print(
//           "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
//       return; // Dừng thực hiện nếu giỏ hàng trống
//     }

//     for (int index = 0; index < updatedProducts.length; index++) {
//       var product = updatedProducts[index];

//       if (product['user_seller'] == null ||
//           product['product_price'] == null ||
//           product['product_quantity'] == null ||
//           product.isEmpty) {
//         print("Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.");
//         return; // Dừng thực hiện nếu thông tin sản phẩm không hợp lệ
//       }

//       int quantity = -product['product_quantity'];
//       String id = product['product_id'];
//       final resultquanli = await updateProduct(id: id, quantity: quantity);

//       if (resultquanli['quantity'] < 0 ||
//           resultquanli['status'] == false ||
//           resultquanli['approve'] == false) {
//         print(
//             "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác.");
//         try {
//           int qua = product['product_quantity'];
//           final result = await updateProduct(id: id, quantity: qua);
//           print('Product updated successfully: $result');
//           return;
//         } catch (e) {
//           print('Failed to update product: $e');
//         }
//       }

//       var order = await createOrder({
//         'user_id_buyer': product['user_buyer'],
//         'user_id_seller': product['user_seller'],
//         'name': fullName.text, // Sử dụng fullName.text
//         'phone': phoneNumber.text, // Sử dụng phoneNumber.text
//         'provinceId': selectedProvinceId,
//         'districtId': selectedDistrictId,
//         'address': address.text, // Sử dụng address.text
//         'total_amount':
//             product['product_price'] * product['product_quantity'], // Tổng tiền
//         'note': product['note'],
//       });

//       await createOrderDetail({
//         'order_id': order['data']['_id'],
//         'product_id': product['product_id'],
//         'quantity': product['product_quantity'],
//         'price': product['product_price'],
//       });

//       if (loginInfo.name != null) {
//         await createNotification({
//           'user_id_created': loginInfo.id,
//           'user_id_receive': loginInfo.id,
//           'message':
//               'Bạn đã đặt thành công đơn hàng ${product['product_name']}: ${order['data']['total_amount']} VNĐ.',
//         });
//       }

//       await createNotification({
//         'user_id_created': loginInfo.id,
//         'user_id_receive': product['user_seller'],
//         'message':
//             'Có đơn hàng ${product['product_name']} của ${order['data']['name']} số điện thoại ${order['data']['phone']} đang chờ bạn xác nhận.',
//       });

//       if (product['_id'] != null) {
//         String idpro = product['_id'];
//         print(idpro);
//         await removeFromCart(idpro);
//       }
//     }

//     if (_paymentMethod == 'onlinepay') {
//       Navigator.push(
//         context,
//         MaterialPageRoute(
//             builder: (context) => PaymentInfo(products: productCart)),
//       );
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Hãy thanh toán khi nhận hàng.')),
//       );
//       Navigator.push(
//         context,
//         MaterialPageRoute(builder: (context) => MainScreen()),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Đặt hàng"),
//       ),
//       body: Column(
//         children: [
//           Expanded(
//             child: SingleChildScrollView(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Padding(
//                     padding: const EdgeInsets.all(4.0),
//                     child: Text(
//                       'Thông tin đơn hàng',
//                       style:
//                           TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                   Container(
//                       height: 90,
//                       // color: Colors.red,
//                       child: GestureDetector(
//                         onTap: () {
//                           List<Map<String, dynamic>> updatedProducts =
//                               createUpdatedProductList();
//                           print(updatedProducts);
//                         },
//                         child: Card(
//                           color: Colors.amber,
//                           child: Row(
//                             mainAxisAlignment: MainAxisAlignment.start,
//                             children: [
//                               Icon(Icons.map),
//                               Column(
//                                 crossAxisAlignment:
//                                     CrossAxisAlignment.start, // Căn lề trái
//                                 mainAxisAlignment: MainAxisAlignment.center,
//                                 children: [
//                                   Row(
//                                     children: [
//                                       Text(
//                                           '${fullName.text}  ${phoneNumber.text}')
//                                     ],
//                                   ),
//                                   Text(address.text),
//                                   Text(
//                                       'Tỉnh/Thành: $provinceName'), // Hiển thị tên tỉnh
//                                   Text('Quận/Huyện: $districtName'),
//                                 ],
//                               ),
//                             ],
//                           ),
//                         ),
//                       )),
//                   Padding(
//                     padding: const EdgeInsets.all(8.0),
//                     child: Column(
//                       children: [
//                         TextField(
//                           controller: fullName,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập họ tên (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: phoneNumber,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập số điện thoại (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         DropdownButtonFormField<String>(
//                           value: selectedProvinceId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.provinces
//                               .map((Province province) {
//                             return DropdownMenuItem<String>(
//                               value: province.id.toString(),
//                               child: Text(province.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onProvinceChanged(value),
//                           hint: Text('Chọn tỉnh/thành phố'),
//                         ),
//                         SizedBox(height: 4.0),
//                         // Dropdown cho quận/huyện
//                         DropdownButtonFormField<String>(
//                           value: selectedDistrictId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.districts
//                               .map((District district) {
//                             return DropdownMenuItem<String>(
//                               value: district.id.toString(),
//                               child: Text(district.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onDistrictChanged(value),
//                           hint: Text('Chọn quận/huyện'),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: address,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập địa chỉ (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: email,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập email',
//                           ),
//                         ),
//                         SizedBox(height: 20.0), // Khoảng cách giữa các phần
//                         Text('Chọn phương thức thanh toán:'),
//                         CupertinoSegmentedControl<String>(
//                           children: {
//                             'onlinepay': Text('Thanh toán online'),
//                             'cash': Text('Thanh toán khi nhận hàng'),
//                           },
//                           onValueChanged: (String value) {
//                             setState(() {
//                               _paymentMethod = value; // Cập nhật lựa chọn
//                             });
//                           },
//                           groupValue: _paymentMethod,
//                         ),
//                         SizedBox(height: 10.0),
//                         Text(
//                           'Phương thức thanh toán đã chọn: ${_paymentMethod ?? "Chưa chọn"}',
//                           style: TextStyle(fontSize: 16),
//                         ),
//                       ],
//                     ),
//                   ),
//                   ListView.builder(
//                     shrinkWrap: true,
//                     physics: NeverScrollableScrollPhysics(),
//                     itemCount: groupedProducts.keys.length,
//                     itemBuilder: (context, sellerIndex) {
//                       String sellerId =
//                           groupedProducts.keys.elementAt(sellerIndex);
//                       List<dynamic> sellerProducts = groupedProducts[sellerId]!;

//                       return Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Padding(
//                             padding: const EdgeInsets.all(8.0),
//                             child: FutureBuilder(
//                               future: fetchSellerName(
//                                   sellerId), // Function to get seller name
//                               builder:
//                                   (context, AsyncSnapshot<String> snapshot) {
//                                 return Text(
//                                   'Người bán: ${snapshot.data ?? "Đang tải..."}',
//                                   style: TextStyle(
//                                       fontSize: 18,
//                                       fontWeight: FontWeight.bold),
//                                 );
//                               },
//                             ),
//                           ),
//                           ListView.builder(
//                             shrinkWrap: true,
//                             physics: NeverScrollableScrollPhysics(),
//                             itemCount: sellerProducts.length,
//                             itemBuilder: (context, productIndex) {
//                               int globalIndex = productCart
//                                   .indexOf(sellerProducts[productIndex]);
//                               return Card(
//                                 child: Padding(
//                                   padding: const EdgeInsets.all(4.0),
//                                   child: Column(
//                                     children: [
//                                       Row(
//                                         children: [
//                                           Container(
//                                             width: 70,
//                                             height: 70,
//                                             child: Image.network(
//                                               sellerProducts[productIndex]
//                                                   ['product_imageUrl'],
//                                               fit: BoxFit.cover,
//                                             ),
//                                           ),
//                                           SizedBox(width: 10),
//                                           Expanded(
//                                             child: Column(
//                                               crossAxisAlignment:
//                                                   CrossAxisAlignment.start,
//                                               children: [
//                                                 Container(
//                                                   width: 120,
//                                                   child: Text(
//                                                     sellerProducts[productIndex]
//                                                         ['product_name'],
//                                                     style:
//                                                         TextStyle(fontSize: 14),
//                                                     maxLines: 1,
//                                                     overflow:
//                                                         TextOverflow.ellipsis,
//                                                     softWrap: false,
//                                                   ),
//                                                 ),
//                                                 Text(
//                                                   '${formatPrice(sellerProducts[productIndex]['product_price'])}đ',
//                                                   style:
//                                                       TextStyle(fontSize: 14),
//                                                 ),
//                                                 Text(
//                                                   'Số lượng: x${sellerProducts[productIndex]['product_quantity']}',
//                                                   style:
//                                                       TextStyle(fontSize: 14),
//                                                 ),
//                                               ],
//                                             ),
//                                           ),
//                                           Container(
//                                             child: Text(
//                                               '${priceOfOne(sellerProducts[productIndex]['product_price'], sellerProducts[productIndex]['product_quantity'])}đ',
//                                               style: TextStyle(
//                                                 color: Colors.red,
//                                                 fontWeight: FontWeight.bold,
//                                               ),
//                                             ),
//                                           ),
//                                         ],
//                                       ),
//                                       TextField(
//                                         controller:
//                                             noteControllers[globalIndex],
//                                         decoration: const InputDecoration(
//                                           border: OutlineInputBorder(),
//                                           hintText: 'Lời nhắn cho người bán',
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//                               );
//                             },
//                           ),
//                         ],
//                       );
//                     },
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           Container(
//             color: Colors.grey[300],
//             padding: EdgeInsets.all(0),
//             child: Row(
//               children: [
//                 Expanded(
//                   flex: 6,
//                   child: Container(
//                     alignment: Alignment.center,
//                     child: Text(
//                       'Tổng: ${sumPriceAll(productCart)}đ',
//                       style: TextStyle(
//                           color: Colors.red,
//                           fontSize: 18,
//                           fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                 ),
//                 Expanded(
//                   flex: 4,
//                   child: ElevatedButton(
//                     style: ElevatedButton.styleFrom(
//                       fixedSize: Size(double.infinity, 50),
//                       backgroundColor: Colors.red,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.zero,
//                       ),
//                     ),
//                     onPressed: () {
//                       // print('$productCart');
//                       // List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
//                       // print('$updatedProducts');
//                       handleCheckout();
//                     },
//                     child: Text(
//                       'Thanh Toán',
//                       style: TextStyle(color: Colors.white, fontSize: 18),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

//CODE MỚI NHẤT
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:mobile/utils/convert.dart';
// import 'package:mobile/providers/login_info.dart';
// import 'package:provider/provider.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// import '../../config.dart';
// import 'payment_info.dart';
// import '../Home/main_screen.dart';
// import '../../providers/location_provider.dart';

// // Model for shipping method
// class ShippingMethod {
//   final String maDvChinh;
//   final String tenDichVu;
//   final double giaCuoc;
//   final String thoiGian;

//   ShippingMethod({
//     required this.maDvChinh,
//     required this.tenDichVu,
//     required this.giaCuoc,
//     required this.thoiGian,
//   });

//   factory ShippingMethod.fromJson(Map<String, dynamic> json) {
//     return ShippingMethod(
//       maDvChinh: json['MA_DV_CHINH']?.toString() ?? '',
//       tenDichVu: json['TEN_DICHVU']?.toString() ?? '',
//       giaCuoc: (json['GIA_CUOC'] is int
//           ? json['GIA_CUOC'].toDouble()
//           : double.tryParse(json['GIA_CUOC']?.toString() ?? '0') ?? 0.0),
//       thoiGian: json['THOI_GIAN']?.toString() ?? '',
//     );
//   }
// }

// class CheckOut extends StatefulWidget {
//   final List<dynamic> products;
//   const CheckOut({
//     super.key,
//     required this.products,
//   });

//   @override
//   _CheckOutState createState() => _CheckOutState();
// }

// class _CheckOutState extends State<CheckOut> {
//   late LoginInfo loginInfo;
//   late LocationProvider locationProvider;
//   late List<dynamic> productCart;
//   late List<TextEditingController> noteControllers;
//   late Map<String, List<dynamic>> groupedProducts;
//   Map<String, double> shippingCosts = {}; // Store shipping cost for each seller
//   Map<String, String> selectedShippingMethods =
//       {}; // Store selected shipping method for each seller
//   Map<String, List<ShippingMethod>> availableShippingMethods =
//       {}; // Store available shipping methods

//   final TextEditingController fullName = TextEditingController();
//   final TextEditingController phoneNumber = TextEditingController();
//   final TextEditingController address = TextEditingController();
//   final TextEditingController email = TextEditingController();
//   String? _paymentMethod;
//   String? provinceName;
//   String? districtName;
//   String? selectedProvinceId;
//   String? selectedDistrictId;

//   @override
//   void initState() {
//     super.initState();
//     productCart = widget.products;
//     loginInfo = Provider.of<LoginInfo>(context, listen: false);
//     locationProvider = Provider.of<LocationProvider>(context, listen: false);
//     groupedProducts = groupProductsBySeller(productCart);

//     noteControllers = productCart.isNotEmpty
//         ? List.generate(productCart.length, (index) => TextEditingController())
//         : [];

//     if (loginInfo.name != null) {
//       fullName.text = loginInfo.name!;
//       phoneNumber.text = loginInfo.phone!;
//       address.text = loginInfo.address!;
//       email.text = loginInfo.email!;
//       selectedProvinceId = loginInfo.provinceId;
//       selectedDistrictId = loginInfo.districtId;
//     }
//     fetchLocationData();
//     fetchShippingCosts(); // Fetch shipping costs and methods when initializing
//   }

//   Map<String, List<dynamic>> groupProductsBySeller(List<dynamic> products) {
//     Map<String, List<dynamic>> groupedProducts = {};
//     for (var product in products) {
//       String sellerId = product['user_seller'].toString();
//       if (!groupedProducts.containsKey(sellerId)) {
//         groupedProducts[sellerId] = [];
//       }
//       groupedProducts[sellerId]!.add(product);
//     }
//     return groupedProducts;
//   }

//   Future<void> fetchLocationData() async {
//     try {
//       setState(() {
//         provinceName = 'Đang tải tỉnh/thành phố...';
//         districtName = 'Chưa chọn quận/huyện';
//       });

//       // Tải danh sách tỉnh/thành phố
//       await locationProvider.fetchProvinces();

//       if (locationProvider.provinces.isEmpty) {
//         print(
//             'Danh sách tỉnh/thành phố trống. Kiểm tra API hoặc kết nối mạng.');
//         setState(() {
//           provinceName = 'Lỗi: Không tải được tỉnh/thành phố';
//         });
//         return;
//       }

//       setState(() {
//         provinceName = null; // Sẵn sàng để người dùng chọn
//       });

//       // Nếu người dùng đã đăng nhập, chọn tỉnh/quận mặc định
//       if (loginInfo.provinceId != null) {
//         final province = locationProvider.provinces.firstWhere(
//           (p) => p.id.toString() == loginInfo.provinceId,
//           orElse: () => Province(id: -1, code: '', name: 'Không tìm thấy tỉnh'),
//         );
//         setState(() {
//           provinceName = province.name;
//           selectedProvinceId = loginInfo.provinceId;
//         });

//         await locationProvider.fetchDistricts(loginInfo.provinceId!);
//         if (locationProvider.districts.isEmpty) {
//           print('Danh sách quận/huyện trống. Kiểm tra API hoặc provinceId.');
//           setState(() {
//             districtName = 'Lỗi: Không tải được quận/huyện';
//           });
//           return;
//         }

//         if (loginInfo.districtId != null) {
//           final district = locationProvider.districts.firstWhere(
//             (d) => d.id.toString() == loginInfo.districtId,
//             orElse: () => District(
//                 id: -1, value: '', name: 'Không tìm thấy quận', provinceId: -1),
//           );
//           setState(() {
//             districtName = district.name;
//             selectedDistrictId = loginInfo.districtId;
//           });
//         }
//       }
//     } catch (e, stackTrace) {
//       print('Lỗi khi tải dữ liệu địa điểm: $e');
//       print('Stack trace: $stackTrace');
//       setState(() {
//         provinceName = 'Lỗi khi tải tỉnh/thành phố';
//         districtName = 'Lỗi khi tải quận/huyện';
//       });
//     }
//   }

//   Future<String> fetchSellerName(String sellerId) async {
//     final String url = 'http://$ip:5555/users/$sellerId';
//     try {
//       final response = await http.get(Uri.parse(url));
//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         return data['name'] ?? 'Người bán không xác định';
//       } else {
//         return 'Lỗi khi tải tên người bán';
//       }
//     } catch (e) {
//       print('Error fetching seller name: $e');
//       return 'Lỗi khi tải tên người bán';
//     }
//   }

//   Future<Map<String, String>> fetchSellerLocation(String sellerId) async {
//     final String url = 'http://$ip:5555/users/$sellerId';
//     try {
//       final response = await http.get(Uri.parse(url));
//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         return {
//           'provinceId': data['provinceId']?.toString() ?? '',
//           'districtId': data['districtId']?.toString() ?? '',
//         };
//       } else {
//         throw Exception('Failed to fetch seller location');
//       }
//     } catch (e) {
//       print('Error fetching seller location: $e');
//       return {'provinceId': '', 'districtId': ''};
//     }
//   }

//   // Modified function to fetch shipping methods and costs
//   Future<List<ShippingMethod>> fetchShippingMethods({
//     required String senderProvince,
//     required String senderDistrict,
//     required String receiverProvince,
//     required String receiverDistrict,
//     required double productWeight,
//     required int productPrice,
//     String? maDvChinh,
//   }) async {
//     const String url = 'https://partner.viettelpost.vn/v2/order/getPriceAll';
//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {
//           'Content-Type': 'application/json',
//           'Token': 'YOUR_VIETTEL_POST_TOKEN',
//         },
//         body: jsonEncode({
//           'SENDER_PROVINCE': int.parse(senderProvince), // Convert to int
//           'SENDER_DISTRICT': int.parse(senderDistrict), // Convert to int
//           'RECEIVER_PROVINCE': int.parse(receiverProvince), // Convert to int
//           'RECEIVER_DISTRICT': int.parse(receiverDistrict), // Convert to int
//           'PRODUCT_TYPE': 'HH',
//           'PRODUCT_WEIGHT': productWeight,
//           'PRODUCT_PRICE': productPrice,
//           'MONEY_COLLECTION': productPrice.toString(),
//           'TYPE': 1,
//           if (maDvChinh != null) 'MA_DV_CHINH': maDvChinh,
//         }),
//       );

//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         // Check if response is directly a list (based on provided API response)
//         if (data is List) {
//           return data.map((item) => ShippingMethod.fromJson(item)).toList();
//         } else if (data['data'] is List) {
//           return (data['data'] as List)
//               .map((item) => ShippingMethod.fromJson(item))
//               .toList();
//         } else if (data['data'] is Map<String, dynamic>) {
//           return [ShippingMethod.fromJson(data['data'])];
//         } else {
//           print('Unexpected data type: ${data.runtimeType}');
//           return [];
//         }
//       } else {
//         print(
//             'Error fetching shipping methods: ${response.statusCode} - ${response.body}');
//         return [];
//       }
//     } catch (e) {
//       print('Error fetching shipping methods: $e');
//       return [];
//     }
//   }

//   // Fetch shipping costs and methods for all sellers
//   Future<void> fetchShippingCosts() async {
//     if (selectedProvinceId == null || selectedDistrictId == null) return;

//     Map<String, double> tempShippingCosts = {};
//     Map<String, List<ShippingMethod>> tempShippingMethods = {};
//     Map<String, String> tempSelectedMethods = {};

//     for (String sellerId in groupedProducts.keys) {
//       final sellerLocation = await fetchSellerLocation(sellerId);
//       if (sellerLocation['provinceId']!.isEmpty ||
//           sellerLocation['districtId']!.isEmpty) {
//         tempShippingCosts[sellerId] = 0.0;
//         tempShippingMethods[sellerId] = [];
//         tempSelectedMethods[sellerId] = '';
//         continue;
//       }

//       double totalWeight = 0.0;
//       int totalPrice = 0;
//       for (var product in groupedProducts[sellerId]!) {
//         totalWeight += (product['product_weight']?.toDouble() ?? 0.0) *
//             (product['product_quantity'] as num);
//         totalPrice += ((product['product_price'] as num) *
//                 (product['product_quantity'] as num))
//             .toInt();
//       }

//       final shippingMethods = await fetchShippingMethods(
//         senderProvince: sellerLocation['provinceId']!,
//         senderDistrict: sellerLocation['districtId']!,
//         receiverProvince: selectedProvinceId!,
//         receiverDistrict: selectedDistrictId!,
//         productWeight: totalWeight,
//         productPrice: totalPrice,
//       );

//       if (shippingMethods.isNotEmpty) {
//         tempShippingMethods[sellerId] = shippingMethods;
//         tempSelectedMethods[sellerId] =
//             shippingMethods.first.maDvChinh; // Default to first method
//         tempShippingCosts[sellerId] = shippingMethods.first.giaCuoc;
//       } else {
//         tempShippingCosts[sellerId] = 0.0;
//         tempShippingMethods[sellerId] = [];
//         tempSelectedMethods[sellerId] = '';
//       }
//     }

//     setState(() {
//       shippingCosts = tempShippingCosts;
//       availableShippingMethods = tempShippingMethods;
//       selectedShippingMethods = tempSelectedMethods;
//     });
//   }

//   // Handle shipping method change
//   void onShippingMethodChanged(String sellerId, String? maDvChinh) {
//     if (maDvChinh != null) {
//       setState(() {
//         selectedShippingMethods[sellerId] = maDvChinh;
//         final selectedMethod = availableShippingMethods[sellerId]!
//             .firstWhere((method) => method.maDvChinh == maDvChinh);
//         shippingCosts[sellerId] = selectedMethod.giaCuoc;
//       });
//     }
//   }

//   Future<void> onProvinceChanged(String? provinceId) async {
//     if (provinceId != null) {
//       setState(() {
//         selectedProvinceId = provinceId;
//         provinceName = locationProvider.provinces
//             .firstWhere((p) => p.id.toString() == provinceId)
//             .name;
//         selectedDistrictId = null;
//         districtName = null;
//       });
//       await locationProvider.fetchDistricts(provinceId);
//       setState(() {
//         districtName = null;
//       });
//       await fetchShippingCosts();
//     }
//   }

//   Future<void> onDistrictChanged(String? districtId) async {
//     if (districtId != null) {
//       setState(() {
//         selectedDistrictId = districtId;
//         districtName = locationProvider.districts
//             .firstWhere((d) => d.id.toString() == districtId)
//             .name;
//       });
//       await fetchShippingCosts();
//     }
//   }

//   List<Map<String, dynamic>> createUpdatedProductList() {
//     return List<Map<String, dynamic>>.generate(productCart.length, (index) {
//       return {
//         ...productCart[index],
//         'note': noteControllers[index].text,
//       };
//     });
//   }

//   String sumPriceAll(List<dynamic> pros) {
//     int sumAll = 0;
//     for (var pro in pros) {
//       int quantity = pro['product_quantity'] as int;
//       int price = pro['product_price'].toInt();
//       sumAll += quantity * price;
//     }
//     double totalShipping =
//         shippingCosts.values.fold(0.0, (sum, cost) => sum + cost);
//     return formatPrice(sumAll + totalShipping.toInt());
//   }

//   String priceOfOne(price, quantity) {
//     final sum = price * quantity;
//     return formatPrice(sum);
//   }

//   Future<dynamic> updateProduct(
//       {required String id, required int quantity}) async {
//     final String url = 'http://$ip:5555/products/quanlity';
//     try {
//       final response = await http.put(
//         Uri.parse(url),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({'id': id, 'quanlity': quantity}),
//       );

//       if (response.statusCode == 200) {
//         return jsonDecode(response.body);
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to update product');
//       }
//     } catch (error) {
//       print('Error updating product: $error');
//       throw error;
//     }
//   }

//   Future<dynamic> createOrder(Map<String, dynamic> info) async {
//     final String url = 'http://$ip:5555/orders';
//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(info),
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         return jsonDecode(response.body);
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order');
//       }
//     } catch (error) {
//       print('Error creating order: $error');
//       throw error;
//     }
//   }

//   Future<dynamic> createOrderDetail(Map<String, dynamic> info) async {
//     final String url = 'http://$ip:5555/orderdetails';
//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(info),
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         return jsonDecode(response.body);
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create order detail');
//       }
//     } catch (error) {
//       print('Error creating order detail: $error');
//       throw error;
//     }
//   }

//   Future<dynamic> createNotification(Map<String, dynamic> notification) async {
//     final String url = 'http://$ip:5555/notifications';
//     try {
//       final response = await http.post(
//         Uri.parse(url),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(notification),
//       );

//       if (response.statusCode == 200 || response.statusCode == 201) {
//         return jsonDecode(response.body);
//       } else {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to create notification');
//       }
//     } catch (error) {
//       print('Error creating notification: $error');
//       throw error;
//     }
//   }

//   Future<void> removeFromCart(String id) async {
//     final String url = 'http://$ip:5555/carts/$id';
//     try {
//       final response = await http.delete(Uri.parse(url));
//       if (response.statusCode != 204) {
//         print('Error: ${response.statusCode} - ${response.body}');
//         throw Exception('Failed to remove item from cart');
//       }
//     } catch (error) {
//       print('Error removing item from cart: $error');
//       throw error;
//     }
//   }

//   Future<void> handleCheckout() async {
//     List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
//     if (fullName.text.isEmpty ||
//         phoneNumber.text.isEmpty ||
//         address.text.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//             content: Text(
//                 'Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ.')),
//       );
//       return;
//     }

//     final phonePattern = RegExp(r'^0\d{9}$');
//     if (!phonePattern.hasMatch(phoneNumber.text)) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//             content:
//                 Text('Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!')),
//       );
//       return;
//     }
//     if (selectedProvinceId == null || selectedDistrictId == null) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Vui lòng chọn tỉnh/thành phố và quận/huyện.')),
//       );
//       return;
//     }

//     if (productCart.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//             content: Text(
//                 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.')),
//       );
//       return;
//     }

//     for (int index = 0; index < updatedProducts.length; index++) {
//       var product = updatedProducts[index];

//       if (product['user_seller'] == null ||
//           product['product_price'] == null ||
//           product['product_quantity'] == null ||
//           product.isEmpty) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//               content: Text(
//                   'Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.')),
//         );
//         return;
//       }

//       int quantity = -product['product_quantity'];
//       String id = product['product_id'];
//       final resultquanli = await updateProduct(id: id, quantity: quantity);

//       if (resultquanli['quantity'] < 0 ||
//           resultquanli['status'] == false ||
//           resultquanli['approve'] == false) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//               content: Text(
//                   'Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác.')),
//         );
//         try {
//           int qua = product['product_quantity'];
//           await updateProduct(id: id, quantity: qua);
//           return;
//         } catch (e) {
//           print('Failed to update product: $e');
//         }
//       }

//       double shippingCost =
//           shippingCosts[product['user_seller'].toString()] ?? 0.0;
//       String shippingMethod =
//           selectedShippingMethods[product['user_seller'].toString()] ?? '';
//       var order = await createOrder({
//         'user_id_buyer': product['user_buyer'],
//         'user_id_seller': product['user_seller'],
//         'name': fullName.text,
//         'phone': phoneNumber.text,
//         'provinceId': selectedProvinceId,
//         'districtId': selectedDistrictId,
//         'address': address.text,
//         'total_amount':
//             (product['product_price'] * product['product_quantity']) +
//                 shippingCost.toInt(),
//         'shipping_cost': shippingCost.toInt(),
//         'shipping_method': shippingMethod, // Add shipping method to order
//         'note': product['note'],
//       });

//       await createOrderDetail({
//         'order_id': order['data']['_id'],
//         'product_id': product['product_id'],
//         'quantity': product['product_quantity'],
//         'price': (product['product_price'] * product['product_quantity']) +
//             shippingCost.toInt(),
//       });

//       if (loginInfo.name != null) {
//         await createNotification({
//           'user_id_created': loginInfo.id,
//           'user_id_receive': loginInfo.id,
//           'message':
//               'Bạn đã đặt thành công đơn hàng ${product['product_name']}: ${order['data']['total_amount']} VNĐ (bao gồm ${formatPrice(shippingCost.toInt())}đ phí vận chuyển).',
//         });
//       }

//       await createNotification({
//         'user_id_created': loginInfo.id,
//         'user_id_receive': product['user_seller'],
//         'message':
//             'Có đơn hàng ${product['product_name']} của ${order['data']['name']} số điện thoại ${order['data']['phone']} đang chờ bạn xác nhận. Phí vận chuyển: ${formatPrice(shippingCost.toInt())}đ, Phương thức: $shippingMethod.',
//       });

//       if (product['_id'] != null) {
//         String idpro = product['_id'];
//         await removeFromCart(idpro);
//       }
//     }

//     if (_paymentMethod == 'onlinepay') {
//       Navigator.push(
//         context,
//         MaterialPageRoute(
//             builder: (context) => PaymentInfo(products: productCart)),
//       );
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Hãy thanh toán khi nhận hàng.')),
//       );
//       Navigator.push(
//         context,
//         MaterialPageRoute(builder: (context) => MainScreen()),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Đặt hàng"),
//       ),
//       body: Column(
//         children: [
//           Expanded(
//             child: SingleChildScrollView(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Padding(
//                     padding: const EdgeInsets.all(4.0),
//                     child: Text(
//                       'Thông tin đơn hàng',
//                       style:
//                           TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                   Container(
//                     height: 90,
//                     child: GestureDetector(
//                       onTap: () {
//                         List<Map<String, dynamic>> updatedProducts =
//                             createUpdatedProductList();
//                         print(updatedProducts);
//                       },
//                       child: Card(
//                         color: Colors.amber,
//                         child: Row(
//                           mainAxisAlignment: MainAxisAlignment.start,
//                           children: [
//                             Icon(Icons.map),
//                             Column(
//                               crossAxisAlignment: CrossAxisAlignment.start,
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Row(
//                                   children: [
//                                     Text(
//                                         '${fullName.text}  ${phoneNumber.text}'),
//                                   ],
//                                 ),
//                                 Text(address.text),
//                                 Text('Tỉnh/Thành: $provinceName'),
//                                 Text('Quận/Huyện: $districtName'),
//                               ],
//                             ),
//                           ],
//                         ),
//                       ),
//                     ),
//                   ),
//                   Padding(
//                     padding: const EdgeInsets.all(8.0),
//                     child: Column(
//                       children: [
//                         TextField(
//                           controller: fullName,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập họ tên (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: phoneNumber,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập số điện thoại (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         DropdownButtonFormField<String>(
//                           value: selectedProvinceId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.provinces
//                               .map((Province province) {
//                             return DropdownMenuItem<String>(
//                               value: province.id.toString(),
//                               child: Text(province.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onProvinceChanged(value),
//                           hint: Text('Chọn tỉnh/thành phố'),
//                         ),
//                         SizedBox(height: 4.0),
//                         DropdownButtonFormField<String>(
//                           value: selectedDistrictId,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: locationProvider.districts
//                               .map((District district) {
//                             return DropdownMenuItem<String>(
//                               value: district.id.toString(),
//                               child: Text(district.name),
//                             );
//                           }).toList(),
//                           onChanged: (value) => onDistrictChanged(value),
//                           hint: Text('Chọn quận/huyện'),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: address,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập địa chỉ (Bắt buộc)',
//                           ),
//                         ),
//                         SizedBox(height: 4.0),
//                         TextField(
//                           controller: email,
//                           decoration: const InputDecoration(
//                             border: OutlineInputBorder(),
//                             hintText: 'Nhập email',
//                           ),
//                         ),
//                         SizedBox(height: 20.0),
//                         // Dropdown for selecting shipping method (global for all sellers)
//                         Text('Chọn phương thức vận chuyển:'),
//                         DropdownButtonFormField<String>(
//                           value: selectedShippingMethods.isNotEmpty
//                               ? selectedShippingMethods.values.first
//                               : null,
//                           decoration: InputDecoration(
//                             border: OutlineInputBorder(),
//                           ),
//                           items: availableShippingMethods.isNotEmpty &&
//                                   availableShippingMethods
//                                       .values.first.isNotEmpty
//                               ? availableShippingMethods.values.first
//                                   .map((method) => DropdownMenuItem<String>(
//                                         value: method.maDvChinh,
//                                         child: Text('${method.tenDichVu}'),
//                                       ))
//                                   .toList()
//                               : [],
//                           onChanged: (value) {
//                             if (value != null) {
//                               groupedProducts.keys.forEach((sellerId) {
//                                 onShippingMethodChanged(sellerId, value);
//                               });
//                             }
//                           },
//                           hint: Text('Chọn phương thức vận chuyển'),
//                         ),
//                         SizedBox(height: 20.0),
//                         Text('Chọn phương thức thanh toán:'),
//                         CupertinoSegmentedControl<String>(
//                           children: {
//                             'onlinepay': Text('Thanh toán online'),
//                             'cash': Text('Thanh toán khi nhận hàng'),
//                           },
//                           onValueChanged: (String value) {
//                             setState(() {
//                               _paymentMethod = value;
//                             });
//                           },
//                           groupValue: _paymentMethod,
//                         ),
//                         SizedBox(height: 10.0),
//                         Text(
//                           'Phương thức thanh toán đã chọn: ${_paymentMethod ?? "Chưa chọn"}',
//                           style: TextStyle(fontSize: 16),
//                         ),
//                       ],
//                     ),
//                   ),
//                   ListView.builder(
//                     shrinkWrap: true,
//                     physics: NeverScrollableScrollPhysics(),
//                     itemCount: groupedProducts.keys.length,
//                     itemBuilder: (context, sellerIndex) {
//                       String sellerId =
//                           groupedProducts.keys.elementAt(sellerIndex);
//                       List<dynamic> sellerProducts = groupedProducts[sellerId]!;
//                       double shippingCost = shippingCosts[sellerId] ?? 0.0;

//                       return Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Padding(
//                             padding: const EdgeInsets.all(8.0),
//                             child: FutureBuilder(
//                               future: fetchSellerName(sellerId),
//                               builder:
//                                   (context, AsyncSnapshot<String> snapshot) {
//                                 return Text(
//                                   'Người bán: ${snapshot.data ?? "Đang tải..."}',
//                                   style: TextStyle(
//                                       fontSize: 18,
//                                       fontWeight: FontWeight.bold),
//                                 );
//                               },
//                             ),
//                           ),
//                           // // Dropdown cho phương thức vận chuyển của người bán
//                           // Padding(
//                           //   padding:
//                           //       const EdgeInsets.symmetric(horizontal: 8.0),
//                           //   child: DropdownButtonFormField<String>(
//                           //     value: selectedShippingMethods[sellerId],
//                           //     decoration: InputDecoration(
//                           //       border: OutlineInputBorder(),
//                           //       labelText: 'Phương thức vận chuyển',
//                           //     ),
//                           //     items: (availableShippingMethods[sellerId] ?? [])
//                           //         .map((method) {
//                           //       return DropdownMenuItem<String>(
//                           //         value: method.maDvChinh,
//                           //         child: Text(
//                           //             '${method.tenDichVu} - ${formatPrice(method.giaCuoc.toInt())}đ (${method.thoiGian})'),
//                           //       );
//                           //     }).toList(),
//                           //     onChanged: (value) =>
//                           //         onShippingMethodChanged(sellerId, value),
//                           //     hint: Text('Chọn phương thức vận chuyển'),
//                           //   ),
//                           // ),
//                           // Hiển thị danh sách sản phẩm của người bán
//                           ListView.builder(
//                             shrinkWrap: true,
//                             physics: NeverScrollableScrollPhysics(),
//                             itemCount: sellerProducts
//                                 .length, // Chỉ lặp qua sản phẩm của người bán hiện tại
//                             itemBuilder: (context, productIndex) {
//                               int globalIndex = productCart
//                                   .indexOf(sellerProducts[productIndex]);
//                               return Card(
//                                 child: Padding(
//                                   padding: const EdgeInsets.all(4.0),
//                                   child: Column(
//                                     children: [
//                                       Row(
//                                         children: [
//                                           Container(
//                                             width: 70,
//                                             height: 70,
//                                             child: Image.network(
//                                               sellerProducts[productIndex]
//                                                   ['product_imageUrl'],
//                                               fit: BoxFit.cover,
//                                             ),
//                                           ),
//                                           SizedBox(width: 10),
//                                           Expanded(
//                                             child: Column(
//                                               crossAxisAlignment:
//                                                   CrossAxisAlignment.start,
//                                               children: [
//                                                 Container(
//                                                   width: 120,
//                                                   child: Text(
//                                                     sellerProducts[productIndex]
//                                                         ['product_name'],
//                                                     style:
//                                                         TextStyle(fontSize: 14),
//                                                     maxLines: 1,
//                                                     overflow:
//                                                         TextOverflow.ellipsis,
//                                                     softWrap: false,
//                                                   ),
//                                                 ),
//                                                 Text(
//                                                   '${formatPrice(sellerProducts[productIndex]['product_price'])}đ',
//                                                   style:
//                                                       TextStyle(fontSize: 14),
//                                                 ),
//                                                 Text(
//                                                   'Số lượng: x${sellerProducts[productIndex]['product_quantity']}',
//                                                   style:
//                                                       TextStyle(fontSize: 14),
//                                                 ),
//                                               ],
//                                             ),
//                                           ),
//                                           Container(
//                                             child: Text(
//                                               '${priceOfOne(sellerProducts[productIndex]['product_price'], sellerProducts[productIndex]['product_quantity'])}đ',
//                                               style: TextStyle(
//                                                 color: Colors.red,
//                                                 fontWeight: FontWeight.bold,
//                                               ),
//                                             ),
//                                           ),
//                                         ],
//                                       ),
//                                       TextField(
//                                         controller:
//                                             noteControllers[globalIndex],
//                                         decoration: const InputDecoration(
//                                           border: OutlineInputBorder(),
//                                           hintText: 'Lời nhắn cho người bán',
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//                               );
//                             },
//                           ),
//                           Padding(
//                             padding:
//                                 const EdgeInsets.symmetric(horizontal: 8.0),
//                             child: Text(
//                               'Phí vận chuyển: ${formatPrice(shippingCost.toInt())}đ',
//                               style:
//                                   TextStyle(fontSize: 16, color: Colors.blue),
//                             ),
//                           ),
//                         ],
//                       );
//                     },
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           Container(
//             color: Colors.grey[300],
//             padding: EdgeInsets.all(0),
//             child: Row(
//               children: [
//                 Expanded(
//                   flex: 6,
//                   child: Container(
//                     alignment: Alignment.center,
//                     child: Text(
//                       'Tổng: ${sumPriceAll(productCart)}đ',
//                       style: TextStyle(
//                           color: Colors.red,
//                           fontSize: 18,
//                           fontWeight: FontWeight.bold),
//                     ),
//                   ),
//                 ),
//                 Expanded(
//                   flex: 4,
//                   child: ElevatedButton(
//                     style: ElevatedButton.styleFrom(
//                       fixedSize: Size(double.infinity, 50),
//                       backgroundColor: Colors.red,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.zero,
//                       ),
//                     ),
//                     onPressed: handleCheckout,
//                     child: Text(
//                       'Thanh Toán',
//                       style: TextStyle(color: Colors.white, fontSize: 18),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mobile/utils/convert.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config.dart';
import 'payment_info.dart';
import '../Home/main_screen.dart';
import '../../providers/location_provider.dart';
import 'payment.dart';

// Model for shipping method
class ShippingMethod {
  final String maDvChinh;
  final String tenDichVu;
  final double giaCuoc;
  final String thoiGian;

  ShippingMethod({
    required this.maDvChinh,
    required this.tenDichVu,
    required this.giaCuoc,
    required this.thoiGian,
  });

  factory ShippingMethod.fromJson(Map<String, dynamic> json) {
    return ShippingMethod(
      maDvChinh: json['MA_DV_CHINH']?.toString() ?? '',
      tenDichVu: json['TEN_DICHVU']?.toString() ?? '',
      giaCuoc: (json['GIA_CUOC'] is int
          ? json['GIA_CUOC'].toDouble()
          : double.tryParse(json['GIA_CUOC']?.toString() ?? '0') ?? 0.0),
      thoiGian: json['THOI_GIAN']?.toString() ?? '',
    );
  }
}

class CheckOut extends StatefulWidget {
  final List<dynamic> products;
  const CheckOut({
    super.key,
    required this.products,
  });

  @override
  _CheckOutState createState() => _CheckOutState();
}

class _CheckOutState extends State<CheckOut> {
  late LoginInfo loginInfo;
  late LocationProvider locationProvider;
  late List<dynamic> productCart;
  late List<TextEditingController> noteControllers;
  late Map<String, List<dynamic>> groupedProducts;
  Map<String, double> shippingCosts = {}; // Store shipping cost for each seller
  Map<String, String> selectedShippingMethods =
      {}; // Store selected shipping method for each seller
  Map<String, List<ShippingMethod>> availableShippingMethods =
      {}; // Store available shipping methods

  final TextEditingController fullName = TextEditingController();
  final TextEditingController phoneNumber = TextEditingController();
  final TextEditingController address = TextEditingController();
  final TextEditingController email = TextEditingController();
  String? _paymentMethod;
  String? provinceName;
  String? districtName;
  String? selectedProvinceId;
  String? selectedDistrictId;

  @override
  void initState() {
    super.initState();
    productCart = widget.products;
    loginInfo = Provider.of<LoginInfo>(context, listen: false);
    locationProvider = Provider.of<LocationProvider>(context, listen: false);
    groupedProducts = groupProductsBySeller(productCart);

    noteControllers = productCart.isNotEmpty
        ? List.generate(productCart.length, (index) => TextEditingController())
        : [];

    if (loginInfo.name != null) {
      fullName.text = loginInfo.name!;
      phoneNumber.text = loginInfo.phone!;
      address.text = loginInfo.address!;
      email.text = loginInfo.email!;
      selectedProvinceId = loginInfo.provinceId;
      selectedDistrictId = loginInfo.districtId;
    }
    fetchLocationData();
    fetchShippingCosts(); // Fetch shipping costs and methods when initializing
  }

  Map<String, List<dynamic>> groupProductsBySeller(List<dynamic> products) {
    Map<String, List<dynamic>> groupedProducts = {};
    for (var product in products) {
      String sellerId = product['user_seller'].toString();
      if (!groupedProducts.containsKey(sellerId)) {
        groupedProducts[sellerId] = [];
      }
      groupedProducts[sellerId]!.add(product);
    }
    return groupedProducts;
  }

  Future<void> fetchLocationData() async {
    try {
      setState(() {
        provinceName = 'Đang tải tỉnh/thành phố...';
        districtName = 'Chưa chọn quận/huyện';
      });

      // Tải danh sách tỉnh/thành phố
      await locationProvider.fetchProvinces();

      if (locationProvider.provinces.isEmpty) {
        print(
            'Danh sách tỉnh/thành phố trống. Kiểm tra API hoặc kết nối mạng.');
        setState(() {
          provinceName = 'Lỗi: Không tải được tỉnh/thành phố';
        });
        return;
      }

      setState(() {
        provinceName = null; // Sẵn sàng để người dùng chọn
      });

      // Nếu người dùng đã đăng nhập, chọn tỉnh/quận mặc định
      if (loginInfo.provinceId != null) {
        final province = locationProvider.provinces.firstWhere(
          (p) => p.id.toString() == loginInfo.provinceId,
          orElse: () => Province(id: -1, code: '', name: 'Không tìm thấy tỉnh'),
        );
        setState(() {
          provinceName = province.name;
          selectedProvinceId = loginInfo.provinceId;
        });

        await locationProvider.fetchDistricts(loginInfo.provinceId!);
        if (locationProvider.districts.isEmpty) {
          print('Danh sách quận/huyện trống. Kiểm tra API hoặc provinceId.');
          setState(() {
            districtName = 'Lỗi: Không tải được quận/huyện';
          });
          return;
        }

        if (loginInfo.districtId != null) {
          final district = locationProvider.districts.firstWhere(
            (d) => d.id.toString() == loginInfo.districtId,
            orElse: () => District(
                id: -1, value: '', name: 'Không tìm thấy quận', provinceId: -1),
          );
          setState(() {
            districtName = district.name;
            selectedDistrictId = loginInfo.districtId;
          });
        }
      }
    } catch (e, stackTrace) {
      print('Lỗi khi tải dữ liệu địa điểm: $e');
      print('Stack trace: $stackTrace');
      setState(() {
        provinceName = 'Lỗi khi tải tỉnh/thành phố';
        districtName = 'Lỗi khi tải quận/huyện';
      });
    }
  }

  Future<String> fetchSellerName(String sellerId) async {
    final String url = 'http://$ip:5555/users/$sellerId';
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['name'] ?? 'Người bán không xác định';
      } else {
        return 'Lỗi khi tải tên người bán';
      }
    } catch (e) {
      print('Error fetching seller name: $e');
      return 'Lỗi khi tải tên người bán';
    }
  }

  Future<Map<String, String>> fetchSellerLocation(String sellerId) async {
    final String url = 'http://$ip:5555/users/$sellerId';
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'provinceId': data['provinceId']?.toString() ?? '',
          'districtId': data['districtId']?.toString() ?? '',
        };
      } else {
        throw Exception('Failed to fetch seller location');
      }
    } catch (e) {
      print('Error fetching seller location: $e');
      return {'provinceId': '', 'districtId': ''};
    }
  }

  // Modified function to fetch shipping methods and costs
  Future<List<ShippingMethod>> fetchShippingMethods({
    required String senderProvince,
    required String senderDistrict,
    required String receiverProvince,
    required String receiverDistrict,
    required double productWeight,
    required int productPrice,
    String? maDvChinh,
  }) async {
    const String url = 'https://partner.viettelpost.vn/v2/order/getPriceAll';
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Token': 'YOUR_VIETTEL_POST_TOKEN',
        },
        body: jsonEncode({
          'SENDER_PROVINCE': int.parse(senderProvince), // Convert to int
          'SENDER_DISTRICT': int.parse(senderDistrict), // Convert to int
          'RECEIVER_PROVINCE': int.parse(receiverProvince), // Convert to int
          'RECEIVER_DISTRICT': int.parse(receiverDistrict), // Convert to int
          'PRODUCT_TYPE': 'HH',
          'PRODUCT_WEIGHT': productWeight,
          'PRODUCT_PRICE': productPrice,
          'MONEY_COLLECTION': productPrice.toString(),
          'TYPE': 1,
          if (maDvChinh != null) 'MA_DV_CHINH': maDvChinh,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Check if response is directly a list (based on provided API response)
        if (data is List) {
          return data.map((item) => ShippingMethod.fromJson(item)).toList();
        } else if (data['data'] is List) {
          return (data['data'] as List)
              .map((item) => ShippingMethod.fromJson(item))
              .toList();
        } else if (data['data'] is Map<String, dynamic>) {
          return [ShippingMethod.fromJson(data['data'])];
        } else {
          print('Unexpected data type: ${data.runtimeType}');
          return [];
        }
      } else {
        print(
            'Error fetching shipping methods: ${response.statusCode} - ${response.body}');
        return [];
      }
    } catch (e) {
      print('Error fetching shipping methods: $e');
      return [];
    }
  }

  // Fetch shipping costs and methods for all sellers
  Future<void> fetchShippingCosts() async {
    if (selectedProvinceId == null || selectedDistrictId == null) return;

    Map<String, double> tempShippingCosts = {};
    Map<String, List<ShippingMethod>> tempShippingMethods = {};
    Map<String, String> tempSelectedMethods = {};

    for (String sellerId in groupedProducts.keys) {
      final sellerLocation = await fetchSellerLocation(sellerId);
      if (sellerLocation['provinceId']!.isEmpty ||
          sellerLocation['districtId']!.isEmpty) {
        tempShippingCosts[sellerId] = 0.0;
        tempShippingMethods[sellerId] = [];
        tempSelectedMethods[sellerId] = '';
        continue;
      }

      double totalWeight = 0.0;
      int totalPrice = 0;
      for (var product in groupedProducts[sellerId]!) {
        totalWeight += (product['product_weight']?.toDouble() ?? 0.0) *
            (product['product_quantity'] as num);
        totalPrice += ((product['product_price'] as num) *
                (product['product_quantity'] as num))
            .toInt();
      }

      final shippingMethods = await fetchShippingMethods(
        senderProvince: sellerLocation['provinceId']!,
        senderDistrict: sellerLocation['districtId']!,
        receiverProvince: selectedProvinceId!,
        receiverDistrict: selectedDistrictId!,
        productWeight: totalWeight,
        productPrice: totalPrice,
      );

      if (shippingMethods.isNotEmpty) {
        tempShippingMethods[sellerId] = shippingMethods;
        tempSelectedMethods[sellerId] =
            shippingMethods.first.maDvChinh; // Default to first method
        tempShippingCosts[sellerId] = shippingMethods.first.giaCuoc;
      } else {
        tempShippingCosts[sellerId] = 0.0;
        tempShippingMethods[sellerId] = [];
        tempSelectedMethods[sellerId] = '';
      }
    }

    setState(() {
      shippingCosts = tempShippingCosts;
      availableShippingMethods = tempShippingMethods;
      selectedShippingMethods = tempSelectedMethods;
    });
  }

  // Handle shipping method change
  void onShippingMethodChanged(String sellerId, String? maDvChinh) {
    if (maDvChinh != null) {
      setState(() {
        selectedShippingMethods[sellerId] = maDvChinh;
        final selectedMethod = availableShippingMethods[sellerId]!
            .firstWhere((method) => method.maDvChinh == maDvChinh);
        shippingCosts[sellerId] = selectedMethod.giaCuoc;
      });
    }
  }

  Future<void> onProvinceChanged(String? provinceId) async {
    if (provinceId != null) {
      setState(() {
        selectedProvinceId = provinceId;
        provinceName = locationProvider.provinces
            .firstWhere((p) => p.id.toString() == provinceId)
            .name;
        selectedDistrictId = null;
        districtName = null;
      });
      await locationProvider.fetchDistricts(provinceId);
      setState(() {
        districtName = null;
      });
      await fetchShippingCosts();
    }
  }

  Future<void> onDistrictChanged(String? districtId) async {
    if (districtId != null) {
      setState(() {
        selectedDistrictId = districtId;
        districtName = locationProvider.districts
            .firstWhere((d) => d.id.toString() == districtId)
            .name;
      });
      await fetchShippingCosts();
    }
  }

  List<Map<String, dynamic>> createUpdatedProductList() {
    return List<Map<String, dynamic>>.generate(productCart.length, (index) {
      return {
        ...productCart[index],
        'note': noteControllers[index].text,
      };
    });
  }

  String sumPriceAll(List<dynamic> pros) {
    int sumAll = 0;
    for (var pro in pros) {
      int quantity = pro['product_quantity'] as int;
      int price = pro['product_price'].toInt();
      sumAll += quantity * price;
    }
    double totalShipping =
        shippingCosts.values.fold(0.0, (sum, cost) => sum + cost);
    return formatPrice(sumAll + totalShipping.toInt());
  }

  String priceOfOne(price, quantity) {
    final sum = price * quantity;
    return formatPrice(sum);
  }

  Future<dynamic> updateProduct(
      {required String id, required int quantity}) async {
    final String url = 'http://$ip:5555/products/quanlity';
    try {
      final response = await http.put(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'id': id, 'quanlity': quantity}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to update product');
      }
    } catch (error) {
      print('Error updating product: $error');
      throw error;
    }
  }

  Future<dynamic> createOrder(Map<String, dynamic> info) async {
    final String url = 'http://$ip:5555/orders';
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(info),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create order');
      }
    } catch (error) {
      print('Error creating order: $error');
      throw error;
    }
  }

  Future<dynamic> createOrderDetail(Map<String, dynamic> info) async {
    final String url = 'http://$ip:5555/orderdetails';
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(info),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create order detail');
      }
    } catch (error) {
      print('Error creating order detail: $error');
      throw error;
    }
  }

  Future<dynamic> createNotification(Map<String, dynamic> notification) async {
    final String url = 'http://$ip:5555/notifications';
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(notification),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create notification');
      }
    } catch (error) {
      print('Error creating notification: $error');
      throw error;
    }
  }

  Future<void> removeFromCart(String id) async {
    final String url = 'http://$ip:5555/carts/$id';
    try {
      final response = await http.delete(Uri.parse(url));
      if (response.statusCode != 204) {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to remove item from cart');
      }
    } catch (error) {
      print('Error removing item from cart: $error');
      throw error;
    }
  }

  Future<void> handleCheckout() async {
    List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
    if (fullName.text.isEmpty ||
        phoneNumber.text.isEmpty ||
        address.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                'Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ.')),
      );
      return;
    }

    final phonePattern = RegExp(r'^0\d{9}$');
    if (!phonePattern.hasMatch(phoneNumber.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content:
                Text('Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!')),
      );
      return;
    }
    if (selectedProvinceId == null || selectedDistrictId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng chọn tỉnh/thành phố và quận/huyện.')),
      );
      return;
    }

    if (productCart.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.')),
      );
      return;
    }

    for (int index = 0; index < updatedProducts.length; index++) {
      var product = updatedProducts[index];

      if (product['user_seller'] == null ||
          product['product_price'] == null ||
          product['product_quantity'] == null ||
          product.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.')),
        );
        return;
      }

      int quantity = -product['product_quantity'];
      String id = product['product_id'];
      final resultquanli = await updateProduct(id: id, quantity: quantity);

      if (resultquanli['quantity'] < 0 ||
          resultquanli['status'] == false ||
          resultquanli['approve'] == false) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác.')),
        );
        try {
          int qua = product['product_quantity'];
          await updateProduct(id: id, quantity: qua);
          return;
        } catch (e) {
          print('Failed to update product: $e');
        }
      }

      double shippingCost =
          shippingCosts[product['user_seller'].toString()] ?? 0.0;
      String shippingMethod =
          selectedShippingMethods[product['user_seller'].toString()] ?? '';
      var order = await createOrder({
        'user_id_buyer': product['user_buyer'],
        'user_id_seller': product['user_seller'],
        'name': fullName.text,
        'phone': phoneNumber.text,
        'provinceId': selectedProvinceId,
        'districtId': selectedDistrictId,
        'address': address.text,
        'total_amount':
            (product['product_price'] * product['product_quantity']) +
                shippingCost.toInt(),
        'shipping_cost': shippingCost.toInt(),
        'shipping_method': shippingMethod, // Add shipping method to order
        'note': product['note'],
      });

      await createOrderDetail({
        'order_id': order['data']['_id'],
        'product_id': product['product_id'],
        'quantity': product['product_quantity'],
        'price': (product['product_price'] * product['product_quantity']) +
            shippingCost.toInt(),
      });

      if (loginInfo.name != null) {
        await createNotification({
          'user_id_created': loginInfo.id,
          'user_id_receive': loginInfo.id,
          'message':
              'Bạn đã đặt thành công đơn hàng ${product['product_name']}: ${order['data']['total_amount']} VNĐ (bao gồm ${formatPrice(shippingCost.toInt())}đ phí vận chuyển).',
        });
      }

      await createNotification({
        'user_id_created': loginInfo.id,
        'user_id_receive': product['user_seller'],
        'message':
            'Có đơn hàng ${product['product_name']} của ${order['data']['name']} số điện thoại ${order['data']['phone']} đang chờ bạn xác nhận. Phí vận chuyển: ${formatPrice(shippingCost.toInt())}đ, Phương thức: $shippingMethod.',
      });

      if (product['_id'] != null) {
        String idpro = product['_id'];
        await removeFromCart(idpro);
      }
    }

    if (_paymentMethod == 'onlinepay') {
      double totalAmount = 0;
      for (var product in productCart) {
        totalAmount += (product['product_price'] as num) *
            (product['product_quantity'] as num);
      }
      totalAmount += shippingCosts.values.fold(0.0, (sum, cost) => sum + cost);

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PaymentInfoVNpay(products: productCart),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hãy thanh toán khi nhận hàng.')),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => MainScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Đặt hàng"),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Text(
                      'Thông tin đơn hàng',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Container(
                    // height: 90,
                    child: GestureDetector(
                      onTap: () {
                        List<Map<String, dynamic>> updatedProducts =
                            createUpdatedProductList();
                        print(updatedProducts);
                      },
                      child: Card(
                        color: Colors.amber,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Icon(Icons.map),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                        '${fullName.text}  ${phoneNumber.text}'),
                                  ],
                                ),
                                // Text(address.text),
                                Container(
                                  width: MediaQuery.of(context).size.width * 0.9, // 90% chiều rộng màn hình
                                  child: Text(
                                    address.text,
                                    overflow: TextOverflow.visible, // Để hiển thị toàn bộ văn bản
                                  ),
                                ),
                                Text('Tỉnh/Thành: $provinceName'),
                                Text('Quận/Huyện: $districtName'),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        TextField(
                          controller: fullName,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập họ tên (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: phoneNumber,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập số điện thoại (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        DropdownButtonFormField<String>(
                          value: selectedProvinceId,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                          ),
                          items: locationProvider.provinces
                              .map((Province province) {
                            return DropdownMenuItem<String>(
                              value: province.id.toString(),
                              child: Text(province.name),
                            );
                          }).toList(),
                          onChanged: (value) => onProvinceChanged(value),
                          hint: Text('Chọn tỉnh/thành phố'),
                        ),
                        SizedBox(height: 4.0),
                        DropdownButtonFormField<String>(
                          value: selectedDistrictId,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                          ),
                          items: locationProvider.districts
                              .map((District district) {
                            return DropdownMenuItem<String>(
                              value: district.id.toString(),
                              child: Text(district.name),
                            );
                          }).toList(),
                          onChanged: (value) => onDistrictChanged(value),
                          hint: Text('Chọn quận/huyện'),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: address,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập địa chỉ (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: email,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập email',
                          ),
                        ),
                        SizedBox(height: 20.0),
                        // Dropdown for selecting shipping method (global for all sellers)
                        Text('Chọn phương thức vận chuyển:'),
                        DropdownButtonFormField<String>(
                          value: selectedShippingMethods.isNotEmpty
                              ? selectedShippingMethods.values.first
                              : null,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                          ),
                          items: availableShippingMethods.isNotEmpty &&
                                  availableShippingMethods
                                      .values.first.isNotEmpty
                              ? availableShippingMethods.values.first
                                  .map((method) => DropdownMenuItem<String>(
                                        value: method.maDvChinh,
                                        child: Text('${method.tenDichVu}'),
                                      ))
                                  .toList()
                              : [],
                          onChanged: (value) {
                            if (value != null) {
                              groupedProducts.keys.forEach((sellerId) {
                                onShippingMethodChanged(sellerId, value);
                              });
                            }
                          },
                          hint: Text('Chọn phương thức vận chuyển'),
                        ),
                        SizedBox(height: 20.0),
                        // Text('Chọn phương thức thanh toán:'),
                        CupertinoSegmentedControl<String>(
                          children: {
                            'onlinepay': Text('Thanh toán online'),
                            'cash': Text('Thanh toán khi nhận hàng'),
                          },
                          onValueChanged: (String value) {
                            setState(() {
                              _paymentMethod = value;
                            });
                          },
                          groupValue: _paymentMethod,
                        ),
                        SizedBox(height: 10.0),
                        // Text(
                        //   'Phương thức thanh toán đã chọn: ${_paymentMethod ?? "Chưa chọn"}',
                        //   style: TextStyle(fontSize: 16),
                        // ),
                      ],
                    ),
                  ),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: groupedProducts.keys.length,
                    itemBuilder: (context, sellerIndex) {
                      String sellerId =
                          groupedProducts.keys.elementAt(sellerIndex);
                      List<dynamic> sellerProducts = groupedProducts[sellerId]!;
                      double shippingCost = shippingCosts[sellerId] ?? 0.0;

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: FutureBuilder(
                              future: fetchSellerName(sellerId),
                              builder:
                                  (context, AsyncSnapshot<String> snapshot) {
                                return Text(
                                  'Người bán: ${snapshot.data ?? "Đang tải..."}',
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                );
                              },
                            ),
                          ),
                          // // Dropdown cho phương thức vận chuyển của người bán
                          // Padding(
                          //   padding:
                          //       const EdgeInsets.symmetric(horizontal: 8.0),
                          //   child: DropdownButtonFormField<String>(
                          //     value: selectedShippingMethods[sellerId],
                          //     decoration: InputDecoration(
                          //       border: OutlineInputBorder(),
                          //       labelText: 'Phương thức vận chuyển',
                          //     ),
                          //     items: (availableShippingMethods[sellerId] ?? [])
                          //         .map((method) {
                          //       return DropdownMenuItem<String>(
                          //         value: method.maDvChinh,
                          //         child: Text(
                          //             '${method.tenDichVu} - ${formatPrice(method.giaCuoc.toInt())}đ (${method.thoiGian})'),
                          //       );
                          //     }).toList(),
                          //     onChanged: (value) =>
                          //         onShippingMethodChanged(sellerId, value),
                          //     hint: Text('Chọn phương thức vận chuyển'),
                          //   ),
                          // ),
                          // Hiển thị danh sách sản phẩm của người bán
                          ListView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemCount: sellerProducts
                                .length, // Chỉ lặp qua sản phẩm của người bán hiện tại
                            itemBuilder: (context, productIndex) {
                              int globalIndex = productCart
                                  .indexOf(sellerProducts[productIndex]);
                              return Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: Column(
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            width: 70,
                                            height: 70,
                                            child: Image.network(
                                              sellerProducts[productIndex]
                                                  ['product_imageUrl'],
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                          SizedBox(width: 10),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Container(
                                                  width: 120,
                                                  child: Text(
                                                    sellerProducts[productIndex]
                                                        ['product_name'],
                                                    style:
                                                        TextStyle(fontSize: 14),
                                                    maxLines: 1,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                    softWrap: false,
                                                  ),
                                                ),
                                                Text(
                                                  '${formatPrice(sellerProducts[productIndex]['product_price'])}đ',
                                                  style:
                                                      TextStyle(fontSize: 14),
                                                ),
                                                Text(
                                                  'Số lượng: x${sellerProducts[productIndex]['product_quantity']}',
                                                  style:
                                                      TextStyle(fontSize: 14),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Container(
                                            child: Text(
                                              '${priceOfOne(sellerProducts[productIndex]['product_price'], sellerProducts[productIndex]['product_quantity'])}đ',
                                              style: TextStyle(
                                                color: Colors.red,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      TextField(
                                        controller:
                                            noteControllers[globalIndex],
                                        decoration: const InputDecoration(
                                          border: OutlineInputBorder(),
                                          hintText: 'Lời nhắn cho người bán',
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 8.0),
                            child: Text(
                              'Phí vận chuyển: ${formatPrice(shippingCost.toInt())}đ',
                              style:
                                  TextStyle(fontSize: 16, color: Colors.blue),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          Container(
            color: Colors.grey[300],
            padding: EdgeInsets.all(0),
            child: Row(
              children: [
                Expanded(
                  flex: 6,
                  child: Container(
                    alignment: Alignment.center,
                    child: Text(
                      'Tổng: ${sumPriceAll(productCart)}đ',
                      style: TextStyle(
                          color: Colors.red,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                Expanded(
                  flex: 4,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      fixedSize: Size(double.infinity, 50),
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero,
                      ),
                    ),
                    onPressed: handleCheckout,
                    child: Text(
                      'Thanh Toán',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
