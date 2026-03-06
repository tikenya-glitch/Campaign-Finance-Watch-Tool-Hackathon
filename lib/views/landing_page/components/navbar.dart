import 'package:flutter/material.dart';

class Navbar extends StatefulWidget {
  final Function(String) onNavigate;
  final int currentPage;

  const Navbar({
    super.key,
    required this.onNavigate,
    required this.currentPage,
  });

  @override
  State<Navbar> createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  final List<dynamic> navItems = ["Home", "Info", "About", "Analytics", Icons.search];

  int get activeIndex => widget.currentPage;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    /// Breakpoints
    final bool isMobile = screenWidth < 600;
    final bool isTablet = screenWidth >= 600 && screenWidth < 1024;

    /// Info page detection
    final bool isInfoPage = widget.currentPage == 1;

    /// Navbar width logic
    final double navbarWidth =
        isInfoPage && !isMobile ? screenWidth * 0.5 : screenWidth;

    return Align(
      alignment: isInfoPage ? Alignment.topRight : Alignment.topCenter,
      child: SizedBox(
        width: navbarWidth,
        child: Container(
          padding: isMobile
              ? const EdgeInsets.symmetric(horizontal: 20, vertical: 16)
              : isTablet
                  ? const EdgeInsets.symmetric(horizontal: 40, vertical: 20)
                  : const EdgeInsets.symmetric(horizontal: 60, vertical: 24),
          decoration: BoxDecoration(
            color: const Color(0xFFB2B1B1).withOpacity(0.8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              /// LOGO (ONLY ON HOME)
              widget.currentPage == 0
                  ? GestureDetector(
                      onTap: () => widget.onNavigate("Home"),
                      child: const Text(
                        "TP",
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                    )
                  : const Opacity(opacity: 0, child: Text("TP")),

              /// Navigation
              isMobile
                  ? IconButton(
                      icon: const Icon(Icons.menu),
                      onPressed: () => _showMobileMenu(context),
                    )
                  : Row(
                      children: List.generate(
                        navItems.length,
                        (index) => _NavItem(
                          item: navItems[index],
                          isActive: activeIndex == index,
                          onTap: () {
                            final section = navItems[index] is IconData
                                ? "Search"
                                : navItems[index];

                            widget.onNavigate(section);
                          },
                        ),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMobileMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFFB2B1B1),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(navItems.length, (index) {
            final item = navItems[index];

            return ListTile(
              leading: item is IconData ? Icon(item) : null,
              title: Text(item is IconData ? "Search" : item),
              onTap: () {
                Navigator.pop(context);

                final section =
                    navItems[index] is IconData ? "Search" : navItems[index];

                widget.onNavigate(section);
              },
            );
          }),
        );
      },
    );
  }
}

/// ---------------------------------------------------------------------------
/// Nav Item Widget
/// ---------------------------------------------------------------------------

class _NavItem extends StatefulWidget {
  final dynamic item;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.item,
    required this.isActive,
    required this.onTap,
  });

  @override
  State<_NavItem> createState() => _NavItemState();
}

class _NavItemState extends State<_NavItem> {
  bool isHovered = false;

  static const double underlineWidth = 35;
  static const double underlineHeight = 2;

  @override
  Widget build(BuildContext context) {
    final bool highlight = isHovered || widget.isActive;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => isHovered = true),
        onExit: (_) => setState(() => isHovered = false),
        child: GestureDetector(
          onTap: widget.onTap,
          child: AnimatedScale(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOut,
            scale: highlight ? 1.08 : 1.0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                /// TEXT / ICON
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 200),
                  curve: Curves.easeOut,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: widget.isActive
                        ? FontWeight.w600
                        : FontWeight.w400,
                    color: highlight
                        ? const Color(0xFF3D4450)
                        : Colors.black.withOpacity(0.7),
                  ),
                  child: widget.item is IconData
                      ? Icon(
                          widget.item,
                          size: 18,
                          color: highlight
                              ? const Color(0xFF3D4450)
                              : Colors.black.withOpacity(0.7),
                        )
                      : Text(widget.item),
                ),

                const SizedBox(height: 8),

                /// UNDERLINE ANIMATION
                Center(
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 180),
                    opacity: isHovered ? 1 : 0,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 220),
                      curve: Curves.easeOutCubic,
                      height: underlineHeight,
                      width: isHovered ? underlineWidth : 0,
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(255, 43, 48, 57),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}