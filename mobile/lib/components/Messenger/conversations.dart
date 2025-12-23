import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Messenger/chat.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';

class Conversations extends StatefulWidget {
  const Conversations({
    super.key,
  });

  @override
  _ConversationsState createState() => _ConversationsState();
}

class _ConversationsState extends State<Conversations> {
  List<dynamic> conversations = []; // Khởi tạo giá trị mặc định
  late LoginInfo loginInfo;
  bool isLoading = true; // Thêm trạng thái loading

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchConversations();
  }

  Future<void> fetchConversations() async {
    try {
      final responseConver = await http.get(Uri.parse('http://$ip:5555/conversations/${loginInfo.id}'));

      if (responseConver.statusCode == 200) {
        final List<dynamic> fetchedConver = json.decode(responseConver.body);

        for (var conver in fetchedConver) {
          final userId = conver['participant1'] == loginInfo.id ? conver['participant2'] : conver['participant1'];
          // Sửa endpoint để lấy thông tin người dùng (ví dụ: /users/$userId)
          final responseUser = await http.get(Uri.parse('http://$ip:5555/users/$userId'));

          if (responseUser.statusCode == 200) {
            final Map<String, dynamic> resultUser = json.decode(responseUser.body);
            conver['user'] = resultUser;
          } else {
            // Xử lý lỗi khi không lấy được thông tin người dùng
            print('Không tải được thông tin người dùng cho ID: $userId, statusCode: ${responseUser.statusCode}');
            conver['user'] = {'name': 'Không xác định'}; // Giá trị mặc định
          }
        }

        setState(() {
          conversations = fetchedConver;
          isLoading = false; // Tắt trạng thái loading
        });
      } else {
        // Xử lý lỗi khi không lấy được danh sách cuộc hội thoại
        print('Không tải được danh sách cuộc hội thoại, statusCode: ${responseConver.statusCode}');
        setState(() {
          isLoading = false; // Tắt trạng thái loading
        });
      }
    } catch (e) {
      // Xử lý lỗi tổng quát
      print('Lỗi khi tải cuộc hội thoại: $e');
      setState(() {
        isLoading = false; // Tắt trạng thái loading
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tin nhắn'),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) // Hiển thị loading
          : Column(
              children: [
                Expanded(
                  // height: 400,
                  child: ListView.builder(
                    itemCount: conversations.length,
                    itemBuilder: (context, index) {
                      final conver = conversations[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                          MaterialPageRoute(builder: (context) => Chat(conversation: conver,)));
                        },
                        child: ListTile(
                          subtitle: Row(
                            children: [
                                ClipOval(
                                child: Image.network(
                                  conver['user']['avatar_url'] ?? '', // Kiểm tra nếu có URL
                                  width: 70.0,
                                  height: 70.0,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      width: 70.0,
                                      height: 70.0,
                                      color: Colors.grey, // Màu nền khi lỗi tải hình
                                    );
                                  },
                                  loadingBuilder: (context, child, loadingProgress) {
                                    if (loadingProgress == null) return child; // Hiển thị hình khi tải xong
                                    return Container(
                                      width: 70.0,
                                      height: 70.0,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Colors.grey, // Màu nền khi đang tải
                                      ),
                                      child: Center(child: CircularProgressIndicator()), // Hiển thị vòng tròn khi tải
                                    );
                                  },
                                ),
                              ),
                              SizedBox(width: 10), 
                              Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(conver['user']['name'] ?? 'Người mua không xác định'),
                                Text(conver['lastMessage']),
                                Text(conver['createdAt'])
                              ],),
                          ],)
                        ),
                      );
                    },
                  ),
                ),
                // ElevatedButton(
                //   onPressed: () {
                //     print(conversations);
                //   },
                //   child: Text('Bam'),
                // ),
              ],
            ),
    );
  }
}