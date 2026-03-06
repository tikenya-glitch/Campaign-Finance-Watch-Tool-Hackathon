import 'package:flutter/material.dart';

/// ---------------------------------------------------------------------------
/// Static Responsive Landing Page
/// ---------------------------------------------------------------------------

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFB2B1B1),
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// Hero Section
            Container(
              height: MediaQuery.of(context).size.height,
              padding: _getResponsivePadding(context),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Left Section
                  Expanded(
                    flex: _isMobile(context) ? 1 : 3,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: _heroLeftContent(context),
                    ),
                  ),

                  /// Right Section
                  if (!_isMobile(context))
                    Expanded(
                      flex: 2,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: _heroRightContent(),
                      ),
                    ),
                ],
              ),
            ),

            /// Other Sections  
          ],
        ),
      ),
    );
  }

  /// ---------------------------------------------------------------------------
  /// Hero Content
  /// ---------------------------------------------------------------------------

  List<Widget> _heroLeftContent(BuildContext context) => [
        _ResponsiveText(
          "Transparency Portal",
          style: const TextStyle(
            fontSize: 64,
            fontWeight: FontWeight.w500,
            color: Colors.white,
          ),
          mobileStyle: const TextStyle(
            fontSize: 42,
            fontWeight: FontWeight.w500,
            color: Colors.white,
          ),
        ),
      ];

  List<Widget> _heroRightContent() => const [
        Text(
          "A FEW WORDS\nABOUT\nSIMPLICITY",
          style: TextStyle(
            fontSize: 14,
            letterSpacing: 1.2,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        SizedBox(height: 20),
        Text(
          "Lorem ipsum dolor sit amet, consectetur "
          "adipiscing elit. Nulla facilisi. "
          "Suspendisse potenti. Donec vel "
          "sapien ut libero venenatis faucibus.",
          style: TextStyle(
            fontSize: 13,
            height: 1.6,
            color: Colors.black54,
          ),
        ),
      ];


  /// ---------------------------------------------------------------------------
  /// Responsive Helpers
  /// ---------------------------------------------------------------------------

  EdgeInsets _getResponsivePadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    if (width > 1200) {
      return const EdgeInsets.symmetric(horizontal: 120, vertical: 80);
    }

    if (width > 800) {
      return const EdgeInsets.symmetric(horizontal: 60, vertical: 60);
    }

    return const EdgeInsets.symmetric(horizontal: 30, vertical: 40);
  }

  bool _isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < 600;
}

/// ---------------------------------------------------------------------------
/// Responsive Text Widget
/// ---------------------------------------------------------------------------

class _ResponsiveText extends StatelessWidget {
  final String text;
  final TextStyle style;
  final TextStyle? mobileStyle;

  const _ResponsiveText(
    this.text, {
    required this.style,
    this.mobileStyle,
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Text(
      text,
      style: isMobile && mobileStyle != null ? mobileStyle : style,
    );
  }
}