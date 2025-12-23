import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import 'package:intl/intl.dart';

class Chat extends StatefulWidget {
  final Map<String, dynamic> conversation;

  const Chat({
    super.key,
    required this.conversation,
  });

  @override
  _ChatState createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  late Map<String, dynamic> convervation;
  late List<dynamic> messages = [];
  late Map<String, dynamic> user = {}; // Khởi tạo với giá trị mặc định
  bool isLoading = true;
  late LoginInfo loginInfo;

  late TextEditingController _mess = TextEditingController();

  @override
  void initState() {
    super.initState();
    convervation = widget.conversation;
    fetchMess();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> fetchMess() async {
    try {
      final responseConver = await http.get(Uri.parse('http://$ip:5555/messages/${convervation['_id']}'));
      setState(() {
        messages = json.decode(responseConver.body);
      });

      final userId = convervation['participant1'] == loginInfo.id ? convervation['participant2'] : convervation['participant1'];
      final responseUser = await http.get(Uri.parse('http://$ip:5555/users/$userId'));
      setState(() {
        user = json.decode(responseUser.body); // Cập nhật thông tin người dùng
        isLoading = false; // Tắt trạng thái loading
      });

    } catch (e) {
      // Xử lý lỗi tổng quát
      print('Lỗi khi tải cuộc hội thoại: $e');
      setState(() {
        isLoading = false; // Tắt trạng thái loading
      });
    }
  }

  void sendMess() async {
    print(_mess.text);
    final response = await http.post(Uri.parse('http://$ip:5555/messages'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'conversationId': convervation['_id'],
        'content': _mess.text,
        'senderId': loginInfo.id,
        'receiverId': convervation['participant1'] == loginInfo.id ? convervation['participant2'] : convervation['participant1']
      }),
    );

    if (response.statusCode == 201) {
      final responseRead = await http.post(Uri.parse('http://$ip:5555/messages/read/${convervation['_id']}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'senderId': loginInfo.id,
        }),
      );
      if (responseRead.statusCode == 200) {
        print('Gửi thành công');
      } else {
        print('Gửi không thành công');
      }
    }
    fetchMess();
    _mess.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipOval(
              child: Image.network(
                user['avatar_url'] ?? '', // Kiểm tra nếu có URL
                width: 50.0,
                height: 50.0,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 50.0,
                    height: 50.0,
                    color: Colors.grey,
                  );
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Container(
                    width: 50.0,
                    height: 50.0,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey,
                    ),
                    child: Center(child: CircularProgressIndicator()),
                  );
                },
              ),
            ),
            SizedBox(width: 10),
            Expanded(
              child: isLoading
                  ? Text('Loading...') // Hiển thị loading
                  : Text(
                      user['name'] ?? 'Tên người dùng',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
            ),
          ],
        ),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) // Hiển thị loading
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final mess = messages[index];
                      final bool isMe = mess['senderId'] == loginInfo.id;

                      return Container(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: Align(
                          alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            decoration: BoxDecoration(
                              color: isMe ? Colors.blue[100] : Colors.grey[300],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  mess['content'],
                                  style: TextStyle(fontSize: 16),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  DateFormat('HH:mm dd/MM/yyyy').format(DateTime.parse(mess['createdAt'])),
                                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Row(
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextField(
                          controller: _mess,
                          decoration: InputDecoration(
                            hintText: 'Nhập tin nhắn...',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        sendMess();
                      },
                      child: Text('Gửi'),
                    ),
                  ],
                ),
              ],
            ),
    );
  }
}