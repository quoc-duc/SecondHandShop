import 'package:flutter/material.dart';
import 'package:mobile/components/Home/main_screen.dart';
import 'package:mobile/components/SellerPage/edit_seller_page.dart';
import 'package:mobile/components/SellerPage/seller_page.dart';
import 'package:provider/provider.dart';
import '../UI/menu_item.dart';
import '../../providers/login_info.dart';
import './user_setting.dart';
import '../../providers/userProfile_provider.dart';
import '../order/sale_order.dart';
import '../Order/purchase_order.dart';
import '../Feedback/form_feedback.dart';
import '../../providers/login_info.dart';
import '../Login/login.dart';

class MenuProfile extends StatefulWidget {
  @override
  _MenuProfileState createState() => _MenuProfileState();
}

class _MenuProfileState extends State<MenuProfile> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final loginInfo = Provider.of<LoginInfo>(context, listen: false);
    final userId = loginInfo.id;

    if (userId != null) {
      await Provider.of<UserProfileProvider>(context, listen: false)
          .fetchUser(userId);
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final userInfo = Provider.of<LoginInfo>(context);
    final userProfileProvider = Provider.of<UserProfileProvider>(context);
    final user = userProfileProvider.user;

    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                (user != null && user.avatarUrl != null)
                    ? CircleAvatar(
                        radius: 50,
                        backgroundImage: NetworkImage(user.avatarUrl!),
                      )
                    : Icon(Icons.person, size: 50),
                Container(
                  margin: const EdgeInsets.only(left: 10),
                  child: Column(
                    children: [
                      Text(userInfo.username ?? 'username',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black)),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Quản lý đơn hàng',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Đơn mua',
              backgroundColor: Colors.white,
              icon: Icons.shopping_cart,
              textColor: Colors.black,
              iconBackgroundColor: Colors.blue,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PurchaseOrder(),
                  ),
                );
              },
            ),
            MenuProfileItem(
              text: 'Đơn bán',
              backgroundColor: Colors.white,
              icon: Icons.shopping_bag,
              textColor: Colors.black,
              iconBackgroundColor: Colors.green,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SaleOrder(),
                  ),
                );
              },
            ),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Tiện ích',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Tin đã đăng',
              backgroundColor: Colors.white,
              icon: Icons.post_add,
              textColor: Colors.black,
              iconBackgroundColor: Colors.red,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EditSellerPage(),
                  ),
                );
              },
            ),
            MenuProfileItem(
              text: 'Đánh giá của tôi',
              backgroundColor: Colors.white,
              icon: Icons.feedback,
              textColor: Colors.black,
              iconBackgroundColor: Colors.blue,
            ),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Khác',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Cài đặt tài khoản',
              backgroundColor: Colors.white,
              icon: Icons.settings,
              textColor: Colors.black,
              iconBackgroundColor: Colors.grey,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => UserInformation(),
                  ),
                );
              },
            ),
            MenuProfileItem(
              text: 'Đóng góp ý kiến',
              backgroundColor: Colors.white,
              icon: Icons.feedback,
              textColor: Colors.black,
              iconBackgroundColor: Colors.grey,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => FeedbackForm(),
                  ),
                );
              },
            ),
            MenuProfileItem(
              text: userInfo.name == null ? 'Đăng nhập' : 'Đăng xuất',
              backgroundColor: Colors.white,
              icon: userInfo.name == null ? Icons.login : Icons.logout,
              textColor: Colors.red,
              iconBackgroundColor: Colors.red,
              onTap: () {
                if (userInfo.name == null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => Login()),
                  );
                } else {
                  Provider.of<LoginInfo>(context, listen: false).logout();
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => MainScreen()),
                    (Route<dynamic> route) => false, // Loại bỏ tất cả các route cũ
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
