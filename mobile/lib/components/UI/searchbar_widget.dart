import 'package:flutter/material.dart';

class SearchbarWidget extends StatelessWidget {
  final String hintText;
  final IconData icon;
  final VoidCallback onTap;

  const SearchbarWidget({
    Key? key,
    required this.hintText,
    required this.icon,
    required this.onTap, required TextStyle hintStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap, // 👈 Thêm vào đây
      child: Container(
        height: 40,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        margin: const EdgeInsets.symmetric(vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.15),
              spreadRadius: 1,
              blurRadius: 3,
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.grey, size: 20),
            SizedBox(width: 8),
            Text(hintText, style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
