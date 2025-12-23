import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../UI/product_card.dart';
import '../../providers/login_info.dart';
import 'package:provider/provider.dart';

class RecommendedProductList extends StatefulWidget {
  final String urlBase;
  const RecommendedProductList({
    super.key,
    required this.urlBase,
  });

  @override
  _RecommendedProductListState createState() => _RecommendedProductListState();
}

class _RecommendedProductListState extends State<RecommendedProductList> {
  List<dynamic> recommendedProducts = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchRecommendedProducts();
  }

  Future<void> fetchRecommendedProducts() async {
    final loginInfo = Provider.of<LoginInfo>(context, listen: false);
    if (!loginInfo.isLoggedIn || loginInfo.id == null) {
      setState(() {
        isLoading = false;
      });
      return;
    }

    final response = await http.get(
      Uri.parse('${widget.urlBase}?user_id=${loginInfo.id}'),
    );

    if (response.statusCode == 200) {
      setState(() {
        recommendedProducts = json.decode(response.body);
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
      print('Failed to load recommended products: ${response.statusCode}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final loginInfo = Provider.of<LoginInfo>(context);
    if (!loginInfo.isLoggedIn || loginInfo.id == null) {
      return const SizedBox.shrink(); // Hide if not logged in
    }

    return isLoading
        ? const Center(child: CircularProgressIndicator())
        : recommendedProducts.isEmpty
            ? const SizedBox.shrink() // Hide if no recommendations
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text(
                      'Sản phẩm gợi ý cho bạn',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 250, // Adjust height as needed
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: recommendedProducts.length,
                      itemBuilder: (context, index) {
                        final product = recommendedProducts[index];
                        return SizedBox(
                          width: 160, // Adjust width for each card
                          child: ProductCard(product: product),
                        );
                      },
                    ),
                  ),
                ],
              );
  }
}
