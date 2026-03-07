import 'package:flutter/material.dart';

class NewsDeadlinesCard extends StatelessWidget {
  const NewsDeadlinesCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFFE6F2FF),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text("NEWS AND DEADLINES", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          Text("Political funding"),
          SizedBox(height: 6),
          Text("Lorem ipsum..."),
        ],
      ),
    );
  }
}