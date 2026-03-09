import 'package:flutter/material.dart';
import 'package:trans_portal/model/cfa_feature_model/cfa_feature_model.dart';
import 'package:trans_portal/views/cfa/widgets/cfa_feature_card.dart';


class CfaFeatureCarouselSection extends StatefulWidget {
  const CfaFeatureCarouselSection({super.key});

  @override
  State<CfaFeatureCarouselSection> createState() =>
      _CfaFeatureCarouselSectionState();
}

class _CfaFeatureCarouselSectionState extends State<CfaFeatureCarouselSection> {
  late final ScrollController _scrollController;

  final List<CfaFeatureModel> _items = [
    CfaFeatureModel(
      title: 'Upcoming Publications',
      description:
          'Stay updated with scheduled campaign finance reports, releases, and upcoming public transparency publications.',
      icon: Icons.calendar_month_outlined,
      imagePath: 'assets/images/publications_banner.png',
    ),
    CfaFeatureModel(
      title: 'News And Deadlines',
      description:
          'Track key notices, reporting dates, filing reminders, and recent developments related to political funding.',
      icon: Icons.newspaper_outlined,
    ),
    CfaFeatureModel(
      title: 'Whistleblowing',
      description:
          'Securely report suspicious campaign finance activity, undeclared funding, or other compliance concerns.',
      icon: Icons.campaign_outlined,
    ),
  ];

  int _activeIndex = 0;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _scrollController.addListener(_handleScroll);
  }

  void _handleScroll() {
    if (!_scrollController.hasClients) return;

    final offset = _scrollController.offset;
    final itemExtent = _lastComputedCardWidth + 18;
    if (itemExtent <= 0) return;

    final nextIndex = (offset / itemExtent).round().clamp(0, _items.length - 1);

    if (nextIndex != _activeIndex && mounted) {
      setState(() {
        _activeIndex = nextIndex;
      });
    }
  }

  double _lastComputedCardWidth = 300;

  double _getCardWidth(double width) {
    if (width >= 1400) return 380;
    if (width >= 1100) return 360;
    if (width >= 850) return 320;
    if (width >= 600) return width * 0.75;
    return width * 0.92;
  }

  double _getCarouselHeight(double width) {
    if (width >= 1100) return 420;
    if (width >= 850) return 400;
    return 380;
  }

  void _scrollLeft() {
    if (!_scrollController.hasClients) return;

    final target = (_scrollController.offset - (_lastComputedCardWidth + 18))
        .clamp(0.0, _scrollController.position.maxScrollExtent);

    _scrollController.animateTo(
      target,
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeOut,
    );
  }

  void _scrollRight() {
    if (!_scrollController.hasClients) return;

    final target = (_scrollController.offset + (_lastComputedCardWidth + 18))
        .clamp(0.0, _scrollController.position.maxScrollExtent);

    _scrollController.animateTo(
      target,
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _scrollController.removeListener(_handleScroll);
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final cardWidth = _getCardWidth(width);
        final carouselHeight = _getCarouselHeight(width);
        _lastComputedCardWidth = cardWidth;

        return Column(
          children: [
            const SizedBox(height: 120), // moves cards downward
            SizedBox(
              height: carouselHeight,
              child: ListView.separated(
                controller: _scrollController,
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: _items.length,
                separatorBuilder: (_, __) => const SizedBox(width: 50),
                itemBuilder: (context, index) {
                  return SizedBox(
                    width: cardWidth,
                    child: CfaFeatureCard(item: _items[index]),
                  );
                },
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                _ArrowButton(icon: Icons.arrow_back, onTap: _scrollLeft),
                const SizedBox(width: 12),
                _ArrowButton(icon: Icons.arrow_forward, onTap: _scrollRight),
                const Spacer(),
                Row(
                  children: List.generate(_items.length, (index) {
                    final isActive = index == _activeIndex;
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.only(left: 8),
                      height: 4,
                      width: isActive ? 38 : 20,
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFF222222)
                            : const Color(0xFFD0D3D8),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}

class _ArrowButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _ArrowButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFE3E7ED)),
        ),
        child: Icon(icon, size: 20, color: const Color(0xFF1A1A1A)),
      ),
    );
  }
}
