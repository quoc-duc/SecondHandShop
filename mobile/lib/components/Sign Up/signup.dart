import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/signup_provider.dart';
import '../UI/edit_text_field.dart'; // Đổi import
import '../../components/UI/custom_button.dart';
import './otpscreen.dart';

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();
  final TextEditingController nameController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    nameController.dispose();
    super.dispose();
  }

  void _handleSignUp(BuildContext context) async {
    final provider = Provider.of<SignUpProvider>(context, listen: false);

    if (provider.isLoading) return;

    if (emailController.text.isEmpty ||
        passwordController.text.isEmpty ||
        nameController.text.isEmpty ||
        confirmPasswordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập đầy đủ thông tin.')),
      );
      return;
    }

    if (passwordController.text.trim() !=
        confirmPasswordController.text.trim()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mật khẩu xác nhận không khớp.')),
      );
      return;
    }

    await provider.signUp(
      username: nameController.text.trim(),
      email: emailController.text.trim(),
      password: passwordController.text.trim(),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(provider.message)),
    );

    if (provider.message == 'Đăng ký thành công!') {
      await provider.sendOtp(emailController.text.trim());
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) =>
                OtpScreen(email: emailController.text.trim())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<SignUpProvider>(context);

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: MediaQuery.of(context).size.height * 0.35,
              width: double.infinity,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('images/register_banner.webp'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Đăng ký',
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  EditableTextField(
                    label: 'Nhập tên',
                    controller: nameController,
                    icon: Icons.person,
                    isEnabled: true,
                  ),
                  const SizedBox(height: 12),
                  EditableTextField(
                    label: 'Nhập email',
                    controller: emailController,
                    icon: Icons.email,
                    isEnabled: true,
                  ),
                  const SizedBox(height: 12),
                  EditableTextField(
                    label: 'Nhập mật khẩu',
                    controller: passwordController,
                    icon: Icons.lock,
                    isEnabled: true,
                    isPassword: true,
                  ),
                  const SizedBox(height: 12),
                  EditableTextField(
                    label: 'Xác nhận mật khẩu',
                    controller: confirmPasswordController,
                    icon: Icons.lock,
                    isEnabled: true,
                    isPassword: true,
                  ),
                  const SizedBox(height: 12),
                  provider.isLoading
                      ? const CircularProgressIndicator()
                      : CustomButton(
                          text: 'Đăng ký',
                          onPressed: () => _handleSignUp(context),
                        ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Đã có tài khoản? '),
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text(
                          'Đăng nhập',
                          style: TextStyle(color: Colors.blue),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
