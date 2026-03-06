import 'package:flutter/material.dart';

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: LayoutBuilder(
        builder: (context, constraints) {
          double width = constraints.maxWidth;

          /// BREAKPOINTS
          bool isMobile = width < 700;
          bool isTablet = width >= 700 && width < 1100;

          /// ADAPTIVE VALUES
          double horizontalPadding = isMobile ? 20 : 40;
          double verticalPadding = isMobile ? 30 : 60;

          double titleSize = isMobile
              ? 30
              : isTablet
              ? 40
              : 48;

          double imageHeight = isMobile ? 240 : 350;

          return Center(
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 1200),

              /// RESPONSIVE PADDING
              padding: EdgeInsets.fromLTRB(
                isMobile ? horizontalPadding - 5 : horizontalPadding - 20,
                isMobile ? verticalPadding - 10 : verticalPadding - 30,
                horizontalPadding,
                verticalPadding,
              ),

              /// RESPONSIVE LAYOUT
              child: isMobile
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        /// TITLE
                        Transform.translate(
                          offset: const Offset(-5, -5),
                          child: Text(
                            "Info",
                            style: TextStyle(
                              fontSize: titleSize,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),

                        const SizedBox(height: 30),

                        const _InfoDescription(),

                        const SizedBox(height: 40),

                        /// IMAGE
                        _VisionImage(height: imageHeight),
                      ],
                    )
                  /// DESKTOP / TABLET
                  : Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        /// LEFT CONTENT
                        Expanded(
                          flex: 5,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Transform.translate(
                                offset: const Offset(-10, -10),
                                child: Text(
                                  "Information",
                                  style: TextStyle(
                                    fontSize: titleSize,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),

                              const SizedBox(height: 40),

                              const _InfoDescription(),
                            ],
                          ),
                        ),

                        const SizedBox(width: 60),

                        /// IMAGE
                        Expanded(
                          flex: 5,
                          child: _VisionImage(height: imageHeight),
                        ),
                      ],
                    ),
            ),
          );
        },
      ),
    );
  }
}

class _InfoDescription extends StatelessWidget {
  const _InfoDescription();

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 460),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "A FEW WORDS\nABOUT\nOUR VISION",
            style: TextStyle(
              fontSize: 14,
              letterSpacing: 1.2,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),

          SizedBox(height: 20),

          Text(
            "Lorem ipsum dolor sit amet, sed ut putent virtute "
            "voluptatibus. Eu lorem primis ocurreret vix. "
            "Moderatius delicatissimi est at, ad sea illum "
            "vidisse. Ut usu hinc vocibus, ut vim soluta "
            "labores tincidunt, ad cum eruditi expetendis.",
            style: TextStyle(fontSize: 15, height: 1.6, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}

class _VisionImage extends StatelessWidget {
  final double height;

  const _VisionImage({required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xfff3f3f3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Image.asset("assets/vision_glasses.png", fit: BoxFit.contain),
      ),
    );
  }
}
