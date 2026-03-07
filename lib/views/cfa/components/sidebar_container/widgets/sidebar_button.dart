import 'package:flutter/material.dart';

class SidebarButton extends StatelessWidget {
  final String title;
  final IconData icon;

  const SidebarButton({
    super.key,
    required this.title,
    required this.icon, required Future<Null> Function() onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFC5A059)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF0B2E4F)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                color: Color(0xFF0B2E4F),
                fontWeight: FontWeight.w600,
              ),
            ),
          )
        ],
      ),
    );
  }
}