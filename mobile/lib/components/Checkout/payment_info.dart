import 'package:flutter/material.dart';

class PaymentInfo extends StatefulWidget {
  final List<dynamic> products;
  const PaymentInfo({
    super.key,
    required this.products,
  });

  @override
  _PaymentInfo createState() => _PaymentInfo();
}

class _PaymentInfo extends State<PaymentInfo>{
  

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text('Thông tin thanh toán'),
      ),
      body: Column(
        children: [
          Text('nội dung')
        ],
      ),
    );
  }
}