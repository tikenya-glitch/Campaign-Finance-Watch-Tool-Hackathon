import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFB2B1B1),
      body: LayoutBuilder(
        builder: (context, constraints) {
          double width = constraints.maxWidth;

          bool isMobile = width < 700;
          bool isTablet = width >= 700 && width < 1100;

          double horizontalPadding = isMobile ? 20 : 40;
          double verticalPadding = isMobile ? 30 : 60;
          double titleSize = isMobile ? 32 : isTablet ? 40 : 48;

          return Column(
            children: [
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    /// MAIN CONTENT - centered container with max width 1200
                    Expanded(
                      child: Align(
                        alignment: Alignment.topLeft,
                        child: Container(
                          width: double.infinity,
                          constraints: const BoxConstraints(maxWidth: 1200),
                          padding: EdgeInsets.symmetric(
                            horizontal: horizontalPadding,
                            vertical: verticalPadding,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              /// TOP SECTION
                              isMobile
                                  ? Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          "About us",
                                          style: TextStyle(
                                            fontSize: titleSize,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        const SizedBox(height: 20),
                                        const _AboutDescription(),
                                      ],
                                    )
                                  : Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Expanded(
                                          flex: 2,
                                          child: Text(
                                            "About us",
                                            style: TextStyle(
                                              fontSize: titleSize,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 40),
                                        const Expanded(
                                          flex: 3,
                                          child: _AboutDescription(),
                                        ),
                                      ],
                                    ),

                              const SizedBox(height: 50),

                              /// IMAGE SECTION
                              Container(
                                height: isMobile ? 180 : 300,
                                // width: double.infinity,
                                width: isMobile ? 300 : 300,
                                color: const Color(0xfff2f2f2),
                                child: Center(
                                  child: Image.network(
                                    "https://images.unsplash.com/photo-1510557880182-3b6b0b6c1d28",
                                    height: isMobile ? 90 : 120,
                                    // width: isMobile ? 40 : 40,
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              /// FOOTER
              const ResponsiveFooter(),
            ],
          );
        },
      ),
    );
  }
}

class _AboutDescription extends StatelessWidget {
  const _AboutDescription();

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "A FEW WORDS ABOUT US",
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.5,
          ),
        ),
        SizedBox(height: 10),
        Text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
          "Vestibulum viverra, mauris vel facilisis fermentum, "
          "lectus elit facilisis nulla, vel luctus nunc nisl vel lorem.",
          style: TextStyle(
            fontSize: 14,
            height: 1.6,
            color: Colors.black54,
          ),
        ),
      ],
    );
  }
}

class ResponsiveFooter extends StatelessWidget {
  const ResponsiveFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {

        /// BREAKPOINT
        bool isMobile = constraints.maxWidth < 700;

        double padding = isMobile ? 16 : 24;

        return Container(
          width: double.infinity,
          color: Colors.white,
          padding: EdgeInsets.symmetric(
            vertical: padding,
            horizontal: padding,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [

              /// CONTENT
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1200),
                child: isMobile
                    ? const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          FooterContact(),
                          SizedBox(height: 12),
                          FooterSocial(),
                        ],
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          FooterContact(),
                          FooterSocial(),
                        ],
                      ),
              ),

              const SizedBox(height: 6),

              const Divider(),

              const SizedBox(height: 4),

              const Text(
                "© 2026 Your Company — All Rights Reserved",
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.black54,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class FooterContact extends StatelessWidget {
  const FooterContact({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Contact",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
        SizedBox(height: 6),
        Text("Email: contact@company.com"),
        Text("Phone: +254 234 567 890"),
        Text("Address: 123 Business Street"),
      ],
    );
  }
}

class FooterSocial extends StatelessWidget {
  const FooterSocial({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Follow Us",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
        SizedBox(height: 6),
        Text("LinkedIn"),
        Text("Twitter"),
        Text("Instagram"),
      ],
    );
  }
}

