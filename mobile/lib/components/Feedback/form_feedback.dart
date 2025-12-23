import 'package:flutter/material.dart';
import 'package:mobile/providers/feedback.provider.dart';
import '../../core/models/feedback_model.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';

class FeedbackForm extends StatefulWidget {
  @override
  State<FeedbackForm> createState() => _FeedbackFormState();
}

class _FeedbackFormState extends State<FeedbackForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController messageController = TextEditingController();

  bool isLoading = false;

  @override
  void dispose() {
    emailController.dispose();
    messageController.dispose();
    super.dispose();
  }

  void _handleFeeadback(BuildContext context) async {
    final provider = Provider.of<FeedbackProvider>(context, listen: false);

    final loginInfo = Provider.of<LoginInfo>(context, listen: false);
    final userIdlongin = loginInfo.id;

    if (isLoading) return;

    if (emailController.text.isEmpty || messageController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập đầy đủ thông tin.')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      UserFeedback userFeedback = UserFeedback(
        userId: userIdlongin,
        email: emailController.text.trim(),
        message: messageController.text.trim(),
      );

      final feedback = await provider.postFeedback(userFeedback);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Gửi phản hồi thành công!'),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Có lỗi xảy ra khi gửi phản hồi.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gửi phản hồi'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: messageController,
              decoration: const InputDecoration(
                labelText: 'Nội dung phản hồi',
                border: OutlineInputBorder(),
              ),
              maxLines: 5,
              keyboardType: TextInputType.multiline,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: isLoading ? null : () => _handleFeeadback(context),
              child: isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Gửi phản hồi'),
            ),
          ],
        ),
      ),
    );
  }
}
