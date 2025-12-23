import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/PostProduct/post_edit_product.dart';
import 'package:mobile/components/Product/product_list.dart';
import 'package:mobile/components/SellerPage/seller_page.dart';
import '../Checkout/checkout.dart';
import '../../utils/convert.dart';
import '../Cart/cart.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../Messenger/chat.dart';

class ProductDetail extends StatefulWidget {
  final Map<String, dynamic> product;

  const ProductDetail({
    super.key,
    required this.product,
  });

  @override
  _ProductDetailState createState() => _ProductDetailState();
}

class _ProductDetailState extends State<ProductDetail> {
  late Map<String, dynamic> product;
  int quantity = 1;
  final TextEditingController _quantityController =
      TextEditingController(text: '1');
  late List<dynamic> comments = [];
  late LoginInfo loginInfo;

  @override
  void initState() {
    super.initState();
    product = widget.product;
    _quantityController.addListener(() {
      String text = _quantityController.text;
      if (text.isEmpty) {
        return;
      }

      int? newValue = int.tryParse(text);
      if (newValue != null && newValue > 0) {
        setState(() {
          quantity = newValue;
        });
      } else {
        _quantityController.text = '1';
        _quantityController.selection =
            TextSelection.fromPosition(TextPosition(offset: 1));
      }
    });
    comments = [];
    fetchComments();
  }

   @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  Future<List<dynamic>> getCartItemsByUserId(String userId) async {
    try {
      final response =
          await http.get(Uri.parse('http://$ip:5555/carts/$userId'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        throw Exception('Failed to load cart items');
      }
    } catch (error) {
      print('Error fetching cart items: $error');
      throw error;
    }
  }

  Future<void> fetchComments() async {
    try {
      final response = await http
          .get(Uri.parse('http://$ip:5555/reviews/product/${product['_id']}'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          comments = data;
        });
      } else {
        throw Exception('Failed to load cart items');
      }
    } catch (error) {
      print('Error fetching cart items: $error');
      throw error;
    }
  }

  Future<void> handleTextToSeller() async {
    // Kiểm tra xem người dùng có phải là người bán không
    if (loginInfo.id != null && (product['user_id'] == loginInfo.id)) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Thông báo"),
          content: Text("Đây là sản phẩm của bạn!"),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
      return;
    }

    // Lấy danh sách các cuộc hội thoại
    final response = await http.get(Uri.parse('http://$ip:5555/conversations/${loginInfo.id}'));
    
    if (response.statusCode == 200) {
      final conversations = json.decode(response.body);

      // Kiểm tra xem đã có cuộc hội thoại nào giữa loginInfo.id và product.user_id chưa
      final existingConversation = conversations.firstWhere(
        (conversation) =>
            (conversation['participant1'] == loginInfo.id && conversation['participant2'] == product['user_id']) ||
            (conversation['participant1'] == product['user_id'] && conversation['participant2'] == loginInfo.id),
        orElse: () => null,
      );
      
      if (existingConversation != null) {
        // Nếu có cuộc hội thoại, chuyển đến trang nhắn tin
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => Chat(conversation: existingConversation,)),
        );
        // Navigator.pushNamed(context, '/message', arguments: {
        //   'userId': loginInfo.id,
        //   'conversationId': existingConversation['_id'],
        // });
      } else {
        // Nếu không, tạo cuộc hội thoại mới
        late String? lg = loginInfo.id;
        final newConversation = await addConversation(lg!, product['user_id']);
        
        // Chuyển đến trang nhắn tin với cuộc hội thoại mới
        Navigator.push(context,
          MaterialPageRoute(builder: (context) => Chat(conversation: newConversation,)));
        // Navigator.pushNamed(context, '/message', arguments: {
        //   'userId': loginInfo.id,
        //   'conversationId': newConversation['_id'],
        // });
      }
    } else {
      // Xử lý lỗi
      print('Lỗi khi lấy danh sách cuộc hội thoại: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> addConversation(String userId1, String userId2) async {
  final response = await http.post(
    Uri.parse('http://$ip:5555/conversations'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'participant1': userId1,
      'participant2': userId2,
    }),
  );

  if (response.statusCode == 201) {
    try {
      return json.decode(response.body); // Giải mã thành Map
    } catch (e) {
      throw Exception('Lỗi khi giải mã phản hồi: $e');
    }
  } else {
    throw Exception('Không thể tạo cuộc hội thoại');
  }
}

  void addToCart(String ub, String us, String pid, String pn, int quantityMax,
      int pqs, int pp, String pu) async {
    final productInCart = await getCartItemsByUserId(ub);
    final isProductInCart =
        productInCart.any((item) => item['product_id'] == pid);

    if (isProductInCart) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sản phẩm đã có trong giỏ hàng!')),
      );
      return;
    }

    if (pqs <= 0 || pqs > quantityMax) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Số lượng nhập không hợp lệ!')),
      );
      return;
    }

    Map<String, dynamic> product = {
      'user_buyer': ub,
      'user_seller': us,
      'product_id': pid,
      'product_name': pn,
      'product_quantity': pqs,
      'product_price': pp,
      'product_imageUrl': pu,
    };

    String jsonProduct = jsonEncode(product);

    try {
      final response = await http.post(
        Uri.parse('http://$ip:5555/carts'),
        headers: {'Content-Type': 'application/json'},
        body: jsonProduct,
      );
      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Sản phẩm đã được thêm vào giỏ hàng thành công!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Có lỗi khi thêm sản phẩm!')),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Có lỗi khi gửi yêu cầu!')),
      );
    }
  }

  void deleteProductById(String id) async {
    try {
      final response = await http.delete(
        Uri.parse('http://$ip:5555/products/$id'),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body); // Trả về sản phẩm
      } else {
        throw Exception(
            'Không có sản phẩm nào. Mã trạng thái: ${response.statusCode}');
      }
    } catch (error) {
      print('Error delete product: $error');
      throw Exception('Không có sản phẩm nào.');
    }
  }

  void showSnackBar(BuildContext context) {
    final snackBar = SnackBar(
      content: Text(loginInfo.id!),
      action: SnackBarAction(
        label: 'ĐÓNG',
        onPressed: () {
          // Code để thực hiện khi nhấn nút "ĐÓNG"
        },
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    final loginInfo = Provider.of<LoginInfo>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(product['name']),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () {
              if (loginInfo.name == null) {
                final snackBar = SnackBar(
                    content: Text('Hãy đăng nhập để có trải nghiệm tốt hơn'));
                ScaffoldMessenger.of(context).showSnackBar(snackBar);
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Cart()),
                );
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        product['image_url'],
                        width: double.infinity,
                        height: 250,
                        fit: BoxFit.contain,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      product['name'],
                      style: const TextStyle(
                          fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Giá: ${formatPrice(product['price'])} đ',
                      style: const TextStyle(fontSize: 20, color: Colors.green),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Còn lại: ${product['quantity']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Mô tả:',
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      product['description'],
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Thương hiệu: ${product['brand']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Tình trạng: ${product['condition']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Xuất xứ: ${product['origin']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8), // Giữ khoảng trống cho nút
                    TextField(
                      controller: _quantityController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Nhập số lượng',
                      ),
                    ),
                    const SizedBox(height: 8,),
                    Center(
  child: Row(
    mainAxisAlignment: MainAxisAlignment.center, // Căn giữa hàng
    children: [
      ElevatedButton.icon(
        onPressed: () => {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SellerPage(
                idSeller: product['user_id'],
              ),
            ),
          )
        },
        icon: Icon(Icons.store), // Biểu tượng cho nút "Xem trang người bán"
        label: Text('Trang người bán'),
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white, backgroundColor: Colors.green, // Màu chữ trắng
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8), // Bo tròn góc
          ),
          minimumSize: Size(150, 50), // Kích thước tối thiểu
        ),
      ),
      SizedBox(width: 10), // Khoảng cách giữa hai nút
      ElevatedButton.icon(
        onPressed: () => {
          handleTextToSeller()
        },
        icon: Icon(Icons.message), // Biểu tượng cho nút "Nhắn tin với người bán"
        label: Text('Nhắn tin'),
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white, backgroundColor: Colors.green, // Màu chữ trắng
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8), // Bo tròn góc
          ),
          minimumSize: Size(100, 50), // Kích thước tối thiểu
        ),
      ),
    ],
  ),
),
                    if (product['user_id'] == loginInfo.id)
                      Column(
                        children: [
                          Center(child: Text('Đây là sản phẩm của bạn')),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              ElevatedButton.icon(
                                onPressed: () => {
                                  Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => PostEditProduct(
                                              product: product)))
                                },
                                label: Text('Chỉnh sửa'),
                                icon: Icon(Icons.edit),
                              ),
                              ElevatedButton.icon(
                                onPressed: () =>
                                    {deleteProductById(product['_id'])},
                                label: Text('Xoá'),
                                icon: Icon(Icons.delete),
                              )
                            ],
                          ),
                        ],
                      ),
                    Container(
                      constraints: BoxConstraints(maxWidth: 800),
                      margin:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 28),
                      padding: EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.2),
                            blurRadius: 8,
                            spreadRadius: 2,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Đánh giá',
                            style: TextStyle(
                                fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 16),
                          if (comments.isNotEmpty)
                            Column(
                              children: comments.map((review) {
                                return Container(
                                  margin: EdgeInsets.only(bottom: 16),
                                  padding: EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    border: Border(
                                        bottom: BorderSide(color: Colors.grey)),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text('Rating: ',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold)),
                                          Row(
                                            children: List.generate(5, (index) {
                                              return Icon(
                                                index < review['rating']
                                                    ? Icons.star
                                                    : Icons.star_border,
                                                color: index < review['rating']
                                                    ? Colors.yellow
                                                    : Colors.grey,
                                              );
                                            }),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 4),
                                      Text(review['comment']),
                                      SizedBox(height: 4),
                                      Text(
                                        'Ngày ${review['createdAt']}',
                                        style: TextStyle(
                                            color: Colors.grey[600],
                                            fontSize: 12),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                            )
                          else
                          Container(
                            width: MediaQuery.of(context).size.width * 0.9,
                            child: 
                          Text('Chưa có đánh giá nào.')
                          ,)
                            
                        ],
                      ),
                    ),
                    Container(
                      height: 400,
                      child: ProductList(
                        urlBase:
                            'http://$ip:5555/products/category/${product['category_id']}',
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Container(
            color: Colors.white,
            // padding: const EdgeInsets.all(16.0),
            child: Row(
              // mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: () {
                      if (loginInfo.name == null) {
                        final snackBar = SnackBar(
                            content: Text(
                                'Hãy đăng nhập để có trải nghiệm tốt hơn'));
                        ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      } else {
                        addToCart(
                          loginInfo.id ?? '',
                          product['user_id'],
                          product['_id'],
                          product['name'],
                          product['quantity'],
                          quantity,
                          product['price'],
                          product['image_url'],
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green, // Màu
                      minimumSize: Size(double.infinity, 50),
                      // padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                    ),
                    child: const Text('Thêm vào giỏ hàng',
                        style: TextStyle(color: Colors.white)),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                      onPressed: () {
                        if ((loginInfo.id != null && (product['user_id'] == loginInfo.id))) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text("Thông báo"),
                              content: Text("Đây là sản phẩm của bạn!"),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(context).pop(),
                                  child: Text("OK"),
                                ),
                              ],
                            ),
                          );
                        return;}
                        int quantity = int.tryParse(_quantityController.text) ?? 0;
                        if (product['quantity'] < quantity) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text("Thông báo"),
                              content: Text("Bạn đã chọn quá số lượng còn lại của sản phẩm!"),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(context).pop(),
                                  child: Text("OK"),
                                ),
                              ],
                            ),
                          );
                        return;}
                        List<dynamic> product1 = [
                          {
                            'user_buyer': loginInfo.id ?? '',
                            'user_seller': product['user_id'],
                            'product_id': product['_id'],
                            'product_name': product['name'],
                            'product_quantity': quantity,
                            'product_price': product['price'],
                            'product_imageUrl': product['image_url'],
                          }
                        ];
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  CheckOut(products: product1)),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red, // Màu nền
                        // padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                        minimumSize: Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(0),
                        ),
                      ),
                      child: const Text('Đặt hàng',
                          style: TextStyle(
                            color: Colors.white,
                          ))),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
