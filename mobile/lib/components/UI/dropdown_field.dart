import 'package:flutter/material.dart';

class EditableDropdown extends StatelessWidget {
  final String label;
  final IconData icon;
  final String? value;
  final String? displayText;
  final bool isEditing;
  final List<DropdownMenuItem<String>> items;
  final Function(String?)? onChanged;

  const EditableDropdown({
    Key? key,
    required this.label,
    required this.icon,
    required this.value,
    required this.displayText,
    required this.isEditing,
    required this.items,
    this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0), // Thêm padding đều
      child: isEditing
          ? DropdownButtonFormField<String>(
              value: value,
              decoration: InputDecoration(
                labelText: label,
                prefixIcon: Icon(icon),
                border: const OutlineInputBorder(),
              ),
              items: items,
              onChanged: onChanged,
            )
          : Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
              decoration: BoxDecoration(
                border:
                    Border.all(color: const Color.fromARGB(255, 213, 213, 213)),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Row(
                children: [
                  Icon(icon, color: Colors.grey),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(label,
                            style: const TextStyle(
                                color: Color.fromARGB(255, 211, 211, 211),
                                fontSize: 12)),
                        Text(
                          displayText ?? 'Chưa chọn',
                          style: const TextStyle(
                              fontSize: 16,
                              color: Colors.grey // hoặc điều kiện như trước
                              ),
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
