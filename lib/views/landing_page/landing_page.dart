import 'package:flutter/material.dart';
import 'package:trans_portal/views/landing_page/components/navbar.dart';
import 'package:trans_portal/views/landing_page/sections/about_page.dart';
import 'package:trans_portal/views/landing_page/sections/home_page.dart';
import 'package:trans_portal/views/landing_page/sections/info_page.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final PageController _pageController = PageController();
  int currentPage = 0;

  final Map<String, int> sectionIndex = {"Home": 0, "Info": 1, "About": 2};

  void navigateToSection(String section) {
    if (!sectionIndex.containsKey(section)) return;

    int index = sectionIndex[section]!;

    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    double indicatorRight = screenWidth > 1200 ? 60 : 25;

    return Scaffold(
      backgroundColor: const Color(0xFFB2B1B1),
      body: Stack(
        children: [
          /// Vertical Section Pages
          PageView(
            controller: _pageController,
            scrollDirection: Axis.vertical,
            onPageChanged: (index) {
              setState(() {
                currentPage = index;
              });
            },
            children: const [HomePage(), InfoPage(), AboutPage()],
          ),

          /// NAVBAR
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Navbar(
              onNavigate: navigateToSection,
              currentPage: currentPage,
            ),
          ),

          /// RIGHT SIDE SECTION INDICATOR
          Positioned(
            right: indicatorRight,
            top: MediaQuery.of(context).size.height * 0.4,
            child: Column(
              children: List.generate(
                3,
                (index) => _SectionIndicator(
                  index: "0${index + 1}",
                  isActive: currentPage == index,
                  onTap: () {
                    _pageController.animateToPage(
                      index,
                      duration: const Duration(milliseconds: 500),
                      curve: Curves.easeInOut,
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionIndicator extends StatelessWidget {
  final String index;
  final bool isActive;
  final VoidCallback onTap;

  const _SectionIndicator({
    required this.index,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: AnimatedDefaultTextStyle(
          duration: const Duration(milliseconds: 250),
          style: TextStyle(
            fontSize: isActive ? 14 : 12,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
            color: isActive ? Colors.black : Colors.black.withOpacity(0.35),
          ),
          child: Text(index),
        ),
      ),
    );
  }
}
