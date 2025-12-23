import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import '../Home/main_screen.dart';
import '../Sign Up/SignUp.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart'; // Thêm thư viện icon

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool _obscurePassword = true; // Trạng thái ẩn hiện mật khẩu

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đăng nhập'),
        backgroundColor: const Color.fromARGB(255, 255, 238, 84), // Màu nền vàng 400 cho AppBar
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(FontAwesomeIcons.user, size: 24), // Icon thông tin đăng nhập
                    SizedBox(width: 8),
                    Text(
                      'Thông tin đăng nhập',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  hintText: 'Nhập email',
                  prefixIcon: const Icon(FontAwesomeIcons.envelope), // Icon email
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: passwordController,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  hintText: 'Nhập mật khẩu',
                  prefixIcon: const Icon(FontAwesomeIcons.lock), // Icon mật khẩu
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? FontAwesomeIcons.eyeSlash : FontAwesomeIcons.eye,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword; // Chuyển đổi trạng thái ẩn hiện mật khẩu
                      });
                    },
                  ),
                ),
                obscureText: _obscurePassword,
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignUp()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green, // Màu nền đỏ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8), // Bo tròn nhẹ 4 góc
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    ),
                    child: Row(
                      children: const [
                        Icon(FontAwesomeIcons.userPlus, color: Colors.white), // Icon đăng ký
                        SizedBox(width: 8),
                        Text(
                          'Đăng ký',
                          style: TextStyle(color: Colors.white), // Màu chữ trắng
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      final bool checkLogin = await Provider.of<LoginInfo>(context, listen: false).login(
                        emailController.text,
                        passwordController.text,
                      );

                      if (checkLogin) {
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(builder: (context) => MainScreen()),
                          (Route<dynamic> route) => false,
                        );
                      } else {
                        emailController.clear();
                        passwordController.clear();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'),
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green, // Màu nền đỏ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8), // Bo tròn nhẹ 4 góc
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    ),
                    child: Row(
                      children: const [
                        Icon(FontAwesomeIcons.signInAlt, color: Colors.white), // Icon đăng nhập
                        SizedBox(width: 8),
                        Text(
                          'Đăng nhập',
                          style: TextStyle(color: Colors.white), // Màu chữ trắng
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      // Thêm logic cho nút quên mật khẩu
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red, // Màu nền đỏ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8), // Bo tròn nhẹ 4 góc
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    ),
                    child: Row(
                      children: const [
                        Icon(
                          FontAwesomeIcons.questionCircle,
                          color: Colors.white, // Màu icon trắng
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Quên mật khẩu',
                          style: TextStyle(color: Colors.white), // Màu chữ trắng
                        ),
                      ],
                    ),
                  ),
                ])
            ],
          ),
        ),
      ),
    );
  }
}