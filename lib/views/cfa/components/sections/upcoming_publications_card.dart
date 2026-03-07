import 'package:flutter/material.dart';

class UpcomingPublicationsCard extends StatelessWidget {
  const UpcomingPublicationsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return _CardTemplate(
      color: const Color(0xFFE8F7EC),
      title: "UPCOMING PUBLICATIONS",
      description: "Here you will find the upcoming publications.",
    );
  }
}

class _CardTemplate extends StatelessWidget {
  final Color color;
  final String title;
  final String description;

  const _CardTemplate({
    required this.color,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Text(description),
          const SizedBox(height: 16),
          OutlinedButton(onPressed: () {}, child: const Text("Read More"))
        ],
      ),
    );
  }
}