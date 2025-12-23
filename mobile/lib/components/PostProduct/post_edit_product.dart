import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
// import '../Product/product_detail.dart';

class PostEditProduct extends StatefulWidget {
  final Map<String, dynamic> product;
  const PostEditProduct({
    super.key,
    required this.product,
  });

  @override
  _PostEditProductState createState() => _PostEditProductState();
}

class _PostEditProductState extends State<PostEditProduct> {
  late LoginInfo loginInfo;
  late List<dynamic> categoriesList = [];
  bool isLoading = true;
  late Map<String, dynamic> pro;

  final TextEditingController imgUrl = TextEditingController();
  final TextEditingController name = TextEditingController();
  final TextEditingController description = TextEditingController();
  final TextEditingController price = TextEditingController();
  final TextEditingController quantity = TextEditingController();
  final TextEditingController brand = TextEditingController();
  final TextEditingController origin = TextEditingController();
  final TextEditingController weight = TextEditingController();
  String? selectedCategoryId;
  String? selectedCondition;

  String? categoryImage;
  String? categoryName;
  File? _image;
  final picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    fetchCategories();
    imgUrl.text =
        'https://www.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F9000.png&w=256&q=95';
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> _pickImage() async {
    final pickedFile = await picker.getImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _uploadImage() async {
    if (_image == null) return;

    final formData = http.MultipartRequest(
      'POST',
      Uri.parse('https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload'),
    )
      ..fields['upload_preset'] = 'images_preset'
      ..files.add(await http.MultipartFile.fromPath('file', _image!.path));

    final response = await formData.send();
    final responseData = await http.Response.fromStream(response);

    if (response.statusCode == 200) {
      final result = jsonDecode(responseData.body);
      setState(() {
        imgUrl.text = result['secure_url'];
      });
      print('Image uploaded: ${imgUrl.text}');
    } else {
      print('Failed to upload image: ${responseData.body}');
    }
  }

  Future<void> fetchCategories() async {
    final response = await http.get(Uri.parse('http://$ip:5555/categories'));
    if (response.statusCode == 200) {
      setState(() {
        categoriesList = jsonDecode(response.body);
        isLoading = false; // Cập nhật trạng thái tải
        // Kiểm tra nếu có sản phẩm và cập nhật thông tin sản phẩm
        if (widget.product.isNotEmpty) {
          imgUrl.text = widget.product['image_url'];
          name.text = widget.product['name'];
          description.text = widget.product['description'];
          price.text = widget.product['price'].toString();
          quantity.text = widget.product['quantity'].toString();
          brand.text = widget.product['brand'];
          selectedCondition = widget.product['condition'];
          origin.text = widget.product['origin'];
          weight.text = widget.product['weight']?.toString() ?? '';
          selectedCategoryId = widget.product['category_id'];

          // Lấy thông tin danh mục dựa trên category_id
          for (var category in categoriesList) {
            if (category['_id'] == selectedCategoryId) {
              categoryImage = category['image_url'];
              categoryName = category['category_name'];
              break;
            }
          }
        }
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không tải được danh mục sản phẩm!')),
      );
      setState(() {
        isLoading = false; // Cập nhật trạng thái tải
      });
    }
  }

  Future<void> postProduct(Map<String, dynamic> product) async {
    final response = await http.post(
      Uri.parse('http://$ip:5555/products'),
      headers: {
        'Content-Type': 'application/json', // Đặt header cho JSON
      },
      body: jsonEncode(product),
    );
    if (response.statusCode == 201) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sản phẩm được lưu và đang chờ xét duyệt!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sản phẩm không thêm được!')),
      );
    }
  }

  Future<void> editProduct(String id, Map<String, dynamic> product) async {
    try {
      final response = await http.put(
        Uri.parse('http://$ip:5555/products/$id'),
        headers: {
          'Content-Type': 'application/json', // Đặt header cho JSON
        },
        body: jsonEncode(product),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Sản phẩm được thay đổi và đang chờ xét duyệt!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sản phẩm không sửa được!')),
        );
      }
    } catch (error) {
      print('Error updating product: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Có lỗi xảy ra khi cập nhật sản phẩm!')),
      );
    }
  }

  Future<void> handle() async {
    if (name.text.isEmpty ||
        description.text.isEmpty ||
        brand.text.isEmpty ||
        origin.text.isEmpty ||
        selectedCondition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hãy nhập đầy đủ thông tin!')),
      );
      return;
    }

    if (selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hãy chọn loại danh mục sản phẩm!')),
      );
      return;
    }

    final priceText = price.text;
    final prices = int.tryParse(priceText);
    if (prices == null || prices <= 0) {
      // Kiểm tra null và giá trị <= 0
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Giá sản phẩm phải lớn hơn 0!')),
      );
      return;
    }

    final quantityText = quantity.text;
    final quantityValue = int.tryParse(quantityText); // Chuyển đổi số lượng
    if (quantityValue == null || quantityValue <= 0) {
      // Kiểm tra null và số lượng <= 0
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Số lượng phải lớn hơn 0!')),
      );
      return;
    }

    final weightText = weight.text;
    final weightValue = double.tryParse(weightText);
    if (weightValue == null || weightValue <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Trọng lượng phải lớn hơn 0!')),
      );
      return;
    }

    await _uploadImage();
    if (_image == null && pro.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hãy chọn hình ảnh!')),
      );
      return;
    }
    ;

    var partner = false;
    // Assuming userInfo is defined somewhere in your component
    if (loginInfo.role == 'partner') {
      partner = true;
    }

    Map<String, dynamic> product = {
      "name": name.text,
      "description": description.text,
      "price": price.text,
      "quantity": quantity.text,
      "user_id": loginInfo.id,
      "category_id": selectedCategoryId,
      "image_url": imgUrl.text,
      "brand": brand.text,
      'condition': selectedCondition,
      "origin": origin.text,
      "partner": partner,
      "weight": weight.text,
      "approve": false,
      "status": true
    };

    if (pro.isEmpty) {
      postProduct(product);
    } else {
      editProduct(pro['_id'], product);
    }
    _resetForm();
  }

  void _resetForm() {
    // Reset các TextEditingController
    imgUrl.text =
        'https://www.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F9000.png&w=256&q=95';
    name.clear();
    description.clear();
    price.clear();
    quantity.clear();
    brand.clear();
    origin.clear();
    weight.clear();
    selectedCondition = null;
    selectedCategoryId = null;
    _image = null; // Đặt lại hình ảnh

    // Cập nhật lại giao diện nếu cần
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    pro = product;
    return Scaffold(
      body: loginInfo.name == null
          ? Center(child: Text('Hãy đăng nhập để có trải nghiệm tốt nhất'))
          : isLoading
              ? Center(
                  child:
                      CircularProgressIndicator()) // Hiển thị loader trong khi tải
              : NestedScrollView(
                  headerSliverBuilder:
                      (BuildContext context, bool innerBoxScrolled) {
                    return <Widget>[
                      SliverAppBar(
                        flexibleSpace: FlexibleSpaceBar(
                          background: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Đăng tin bán hàng',
                                  style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold),
                                ),
                                Icon(Icons.edit)
                              ]),
                        ),
                      ),
                    ];
                  },
                  body: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      child: Column(
                        children: [
                          Container(
                            height: 220,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text('Hình ảnh của sản phẩm'),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10.0),
                                  child: Stack(
                                    alignment: Alignment
                                        .center, // Căn giữa các widget con
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child:
                                            (_image != null && product.isEmpty)
                                                ? Image.file(
                                                    File(_image!
                                                        .path), // Hiển thị hình ảnh đã chọn
                                                    width: double.infinity,
                                                    height: 200,
                                                    fit: BoxFit.contain,
                                                  )
                                                : Image.network(
                                                    imgUrl
                                                        .text, // Thay thế bằng URL hình ảnh hợp lệ
                                                    width: double.infinity,
                                                    height: 200,
                                                    fit: BoxFit.contain,
                                                  ),
                                      ),
                                      Positioned(
                                        child: IconButton(
                                          icon: Icon(Icons.add_a_photo,
                                              size: 30,
                                              color: Colors
                                                  .white), // Biểu tượng thêm hình ảnh
                                          onPressed: _pickImage,
                                        ),
                                      ),
                                    ],
                                  ),
                                )
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: name,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Tên sản phẩm',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: description,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Mô tả sản phẩm',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: price,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Đơn giá',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: weight,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Trọng lượng 1 sản phẩm (g)',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: quantity,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Số lượng',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: brand,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Hãng sản xuất',
                            ),
                          ),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            value: selectedCondition,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Tình trạng sản phẩm',
                            ),
                            items: <String>['Mới', 'Đã qua sử dụng', 'Tái chế']
                                .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              setState(() {
                                selectedCondition =
                                    newValue; // Cập nhật lựa chọn
                              });
                            },
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: origin,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Xuất xứ',
                            ),
                          ),
                          DropdownButton<String>(
                            hint: Text("Chọn danh mục"),
                            value: selectedCategoryId,
                            onChanged: (String? newValue) {
                              setState(() {
                                selectedCategoryId = newValue;
                                // Cập nhật hình ảnh và tên danh mục khi thay đổi
                                for (var category in categoriesList) {
                                  if (category['_id'] == newValue) {
                                    categoryImage = category['image_url'];
                                    categoryName = category['category_name'];
                                    break;
                                  }
                                }
                              });
                            },
                            items: categoriesList.map((category) {
                              return DropdownMenuItem<String>(
                                value: category['_id'],
                                child: Row(
                                  children: [
                                    Image.network(
                                      category['image_url'],
                                      width: 30,
                                      height: 30,
                                      fit: BoxFit.cover,
                                    ),
                                    SizedBox(width: 10),
                                    Text(category['category_name']),
                                  ],
                                ),
                              );
                            }).toList(),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              if (product.isNotEmpty) ...[
                                ElevatedButton(
                                  onPressed: () {
                                    handle();
                                  },
                                  child: Text('Lưu thay đổi'),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    // Navigator.push(context,
                                    // MaterialPageRoute(builder: (context) => ProductDetail(product: product)));
                                  },
                                  child: Text('Xem trước khi lưu'),
                                ),
                              ] else
                                ElevatedButton(
                                  onPressed: () {
                                    handle();
                                  },
                                  child: Text('Đăng tin'),
                                ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                ),
    );
  }
}
