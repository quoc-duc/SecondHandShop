import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/providers/login_info.dart';
import '../../config.dart';
import '../Product/product_list.dart';

class EditSellerPage extends StatefulWidget {
  const EditSellerPage({
    super.key,
  });

  @override
  _EditSellerPageState createState() => _EditSellerPageState();
}

class _EditSellerPageState extends State<EditSellerPage> with SingleTickerProviderStateMixin {
  late LoginInfo loginInfo;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: loginInfo.name == null
          ? Center(child: Text('Hãy đăng nhập để có trải nghiệm tốt nhất'))
          : NestedScrollView(
              headerSliverBuilder: (BuildContext context, bool innerBoxScrolled) {
                return <Widget>[
                  SliverAppBar(
                    title: Text('Trang Bán Hàng'),
                    pinned: true, // Để giữ AppBar trên cùng
                    floating: false, // Không cho phép cuộn lên xuống
                    bottom: TabBar(
                      controller: _tabController,
                      tabs: [
                        Tab(text: 'Đã xét duyệt'),
                        Tab(text: 'Đã hết hàng'),
                        Tab(text: 'Chờ xét duyệt'),
                      ],
                    ),
                  ),
                ];
              },
              body: TabBarView(
                controller: _tabController,
                children: [
                  ProductList(urlBase: 'http://$ip:5555/products/user/${loginInfo.id}'),
                  ProductList(urlBase: 'http://$ip:5555/products/soldout/user/${loginInfo.id}'),
                  ProductList(urlBase: 'http://$ip:5555/products/notapprove/user/${loginInfo.id}'),
                ],
              ),
            ),
    );
  }
}