import 'package:flutter/material.dart';

class MenuProfileItem extends StatelessWidget {
  final String text;
  final IconData? icon;
  final Color textColor;
  final Color backgroundColor;
  final Color? iconBackgroundColor;
  final VoidCallback? onTap; // Thêm onTap

  const MenuProfileItem({
    Key? key,
    required this.text,
    this.icon,
    this.textColor = Colors.black,
    this.backgroundColor = Colors.white,
    this.iconBackgroundColor,
    this.onTap, // Nhận tham số onTap
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap, // Xử lý sự kiện nhấn vào mục
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.all(5),
        padding: const EdgeInsets.all(5), // Thêm padding để dễ bấm hơn
        color: backgroundColor,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: iconBackgroundColor,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 18, // Tăng kích thước icon để dễ nhìn hơn
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
