import 'package:flutter/material.dart';
import '../Login/login.dart';

class BeforeLogin extends StatelessWidget {
  const BeforeLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đăng nhập'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Hãy đăng nhập để có trải nghiệm tốt nhất.'),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Login()),
                );
              },
              icon: const Icon(Icons.login), // Thêm biểu tượng
              label: const Text('Đăng nhập'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.green, // Màu chữ trắng
              ),
            ),
          ],
        ),
      ),
    );
  }
}