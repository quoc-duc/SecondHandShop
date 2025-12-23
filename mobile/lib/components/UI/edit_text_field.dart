import 'package:flutter/material.dart';

class EditableTextField extends StatefulWidget {
  final String label;
  final TextEditingController controller;
  final IconData icon;
  final bool isEnabled;
  final bool isPassword;

  const EditableTextField({
    Key? key,
    required this.label,
    required this.controller,
    required this.icon,
    required this.isEnabled,
    this.isPassword = false,
  }) : super(key: key);

  @override
  State<EditableTextField> createState() => _EditableTextFieldState();
}

class _EditableTextFieldState extends State<EditableTextField> {
  bool obscureText = true;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: TextField(
        controller: widget.controller,
        enabled: widget.isEnabled,
        obscureText: widget.isPassword ? obscureText : false,
        decoration: InputDecoration(
          labelText: widget.label,
          prefixIcon: Icon(widget.icon),
          border: const OutlineInputBorder(),
          suffixIcon: widget.isPassword
              ? IconButton(
                  icon: Icon(
                    obscureText ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    setState(() {
                      obscureText = !obscureText;
                    });
                  },
                )
              : null,
        ),
      ),
    );
  }
}
