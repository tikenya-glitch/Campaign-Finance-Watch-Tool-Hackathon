import 'package:flutter/material.dart';
import 'package:trans_portal/model/cfa_feature_model/cfa_feature_model.dart';

class CfaFeatureCard extends StatelessWidget {
  final CfaFeatureModel item;

  const CfaFeatureCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: item.onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFE7EAF0)),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              blurRadius: 14,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTopImage(),
            const SizedBox(height: 14),
            Text(
              item.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 16,
                height: 1.15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF171717),
              ),
            ),
            const SizedBox(height: 18),
            Container(
              width: 24,
              height: 2,
              color: const Color(0xFFB8BDC7),
            ),
            const SizedBox(height: 18),
            Expanded(
              child: Text(
                item.description,
                maxLines: 5,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.35,
                  color: Color(0xFF5E6572),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: const Color(0xFFF4F5F7),
                borderRadius: BorderRadius.circular(17),
              ),
              child: Icon(
                item.icon,
                size: 18,
                color: const Color(0xFF2A2A2A),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopImage() {
    if (item.imagePath == null) {
      return const SizedBox(height: 12);
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: SizedBox(
        height: 140,
        width: double.infinity,
        child: Image.asset(
          item.imagePath!,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) {
            return Container(
              height: 140,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFFDDE7FF),
                    Color(0xFFBFD3FF),
                    Color(0xFFEAF1FF),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              alignment: Alignment.centerLeft,
              padding: const EdgeInsets.all(18),
              child: const Text(
                'Publications and Reports',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  height: 1.1,
                  fontWeight: FontWeight.w600,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}