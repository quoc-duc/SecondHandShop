import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';

class Notifications extends StatefulWidget {
  const Notifications({
    super.key,
  });

  @override
  _NotificationsState createState() => _NotificationsState();
}

class _NotificationsState extends State<Notifications> {
  late LoginInfo loginInfo;
  List<dynamic> notifications = []; // Danh sách thông báo
  int unreadCount = 0; // Số lượng thông báo chưa đọc

  @override
  void initState() {
    super.initState();
    loginInfo = Provider.of<LoginInfo>(context, listen: false);
    fetchNotifications(); // Gọi hàm fetchNotifications
  }

  Future<void> fetchNotifications() async {
    try {
      final response = await http.get(Uri.parse('http://$ip:5555/notifications/user/${loginInfo.id}'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Sắp xếp thông báo theo thứ tự gần nhất
        data.sort((a, b) => DateTime.parse(b['createdAt']).compareTo(DateTime.parse(a['createdAt'])));
        
        setState(() {
          notifications = data; // Cập nhật danh sách thông báo
          unreadCount = notifications.where((notification) => !notification['readed']).length; // Đếm thông báo chưa đọc
        });
      } else {
        setState(() {
          notifications = [];
          unreadCount = 0;
        });
      }
    } catch (error) {
      print("Error fetching notifications: $error");
      setState(() {
        notifications = [];
        unreadCount = 0;
      });
    }
  }

  void handleReaded(notificationId) async {
    final readed = true;
    final response = await http.put(Uri.parse('http://$ip:5555/notifications/update'),
    headers: {'Content-Type': 'application/json', },
    body: json.encode({
        'notificationId': notificationId,
        'readed': readed,
      }));
    if(response.statusCode == 200){
      print('Đánh dấu đã đọc.');
    }else{
      print('Không thể đánh dấu đã đọc tin');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Thông báo ($unreadCount)"),
      ),
      body: Container(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: notifications.length,
                itemBuilder: (context, index) {
                  final notification = notifications[index];
                  return GestureDetector(
                    onTap: () {
                      print(notification);
                      handleReaded(notification['_id']);
                    },
                    child: ListTile(
                      title: Text(notification['message'], style: notification['readed'] == false? TextStyle(fontWeight: FontWeight.bold) : null),
                      subtitle: Text(notification['createdAt'], style: notification['readed'] == false? TextStyle(fontWeight: FontWeight.bold) : null),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}