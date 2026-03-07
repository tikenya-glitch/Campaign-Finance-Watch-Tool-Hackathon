import 'package:flutter/material.dart';

class WhistleblowingCard extends StatelessWidget {
  const WhistleblowingCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFFFFE9E9),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: const [
          Icon(Icons.sports, size: 40, color: Colors.red),
          SizedBox(width: 16),
          Expanded(
            child: Text(
              "WHISTLEBLOWING\nReport suspicious campaign finance activities securely.",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          )
        ],
      ),
    );
  }
}