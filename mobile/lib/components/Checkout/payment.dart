import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../Home/main_screen.dart';

class PaymentInfoVNpay extends StatefulWidget {
  final List<dynamic> products;
  const PaymentInfoVNpay({super.key, required this.products});

  @override
  _PaymentInfoState createState() => _PaymentInfoState();
}

class _PaymentInfoState extends State<PaymentInfoVNpay> {
  late WebViewController _controller;
  bool _isLoading = true;
  String? _paymentUrl;

  @override
  void initState() {
    super.initState();
    _fetchPaymentUrl();
  }

  Future<void> _fetchPaymentUrl() async {
    try {
      // Calculate total amount
      double totalAmount = 0;
      for (var product in widget.products) {
        totalAmount += (product['product_price'] as num) *
            (product['product_quantity'] as num);
      }

      // Call VNPay API to get payment URL
      final response = await http.post(
        Uri.parse('http://$ip:5555/vnPayCheckout/create_payment_url'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': totalAmount,
          'orderDescription': 'Thanh toán đơn hàng',
          'orderType': 'other',
          'language': 'vn',
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        setState(() {
          _paymentUrl = data['paymentUrl'];
        });

        // Initialize WebView
        _controller = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setNavigationDelegate(
            NavigationDelegate(
              onPageStarted: (String url) {
                setState(() {
                  _isLoading = true;
                });
              },
              onPageFinished: (String url) {
                setState(() {
                  _isLoading = false;
                });
              },
              onNavigationRequest: (NavigationRequest request) async {
                // Check if the URL is the VNPay return URL
                if (request.url.contains('vnp_ReturnUrl')) {
                  // Parse query parameters from the return URL
                  final uri = Uri.parse(request.url);
                  final vnpParams = uri.queryParameters;

                  // Call backend to verify payment
                  final checkResponse = await http.get(
                    Uri.parse(
                        'http://$ip:5555/vnPayCheckout/check-payment-vnpay?${uri.query}'),
                  );

                  if (checkResponse.statusCode == 200) {
                    final result = jsonDecode(checkResponse.body);
                    if (result['code'] == '00') {
                      // Payment successful
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Thanh toán thành công!')),
                      );
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => MainScreen()),
                      );
                    } else {
                      // Payment failed
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                            content: Text(
                                'Thanh toán thất bại: ${result['message']}')),
                      );
                      Navigator.pop(context); // Return to checkout screen
                    }
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Lỗi khi kiểm tra thanh toán')),
                    );
                    Navigator.pop(context);
                  }
                  return NavigationDecision
                      .prevent; // Prevent WebView from navigating to return URL
                }
                return NavigationDecision.navigate;
              },
            ),
          );

        if (_paymentUrl != null) {
          _controller.loadRequest(Uri.parse(_paymentUrl!));
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể tạo URL thanh toán')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      print('Error fetching payment URL: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi kết nối với VNPay')),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Thanh toán VNPay'),
      ),
      body: Stack(
        children: [
          if (_paymentUrl != null)
            WebViewWidget(controller: _controller)
          else
            Center(child: Text('Đang chuẩn bị trang thanh toán...')),
          if (_isLoading) Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
