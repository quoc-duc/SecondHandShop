import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/signup_provider.dart';
import '../Login/login.dart';

class OtpScreen extends StatefulWidget {
  final String email;
  const OtpScreen({super.key, required this.email});

  @override
  _OtpScreenState createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final TextEditingController otpController = TextEditingController();

  void _verifyOtp(BuildContext context) async {
    final provider = Provider.of<SignUpProvider>(context, listen: false);

    if (otpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập mã OTP.')),
      );
      return;
    }

    await provider.verifyOtp(widget.email, otpController.text.trim());

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(provider.message)),
    );

    if (provider.message == 'Xác thực OTP thành công!') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Login()),
      ); // Điều hướng đến trang chính
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Xác nhận OTP')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text('Nhập mã OTP đã gửi đến email của bạn'),
            const SizedBox(height: 20),
            TextField(
              controller: otpController,
              decoration: const InputDecoration(
                labelText: 'Mã OTP',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _verifyOtp(context),
              child: const Text('Xác nhận OTP'),
            ),
          ],
        ),
      ),
    );
  }
}
