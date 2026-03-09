import 'package:flutter/material.dart';

class SidebarButton extends StatefulWidget {
  final String title;
  final IconData icon;
  final Future<void> Function() onPressed;
  final bool isActive;

  const SidebarButton({
    super.key,
    required this.title,
    required this.icon,
    required this.onPressed,
    this.isActive = false,
  });

  @override
  State<SidebarButton> createState() => _SidebarButtonState();
}

class _SidebarButtonState extends State<SidebarButton> {
  bool isHovered = false;
  bool isPressed = false;

  @override
  Widget build(BuildContext context) {
    final bool active = widget.isActive;

    final Color borderColor =
        active ? const Color(0xFFC5A059) : const Color(0xFFC5A059);

    final Color backgroundColor = active
        ? const Color(0xFFC5A059).withOpacity(0.15)
        : isHovered
            ? const Color(0xFFC5A059).withOpacity(0.08)
            : Colors.transparent;

    final Color iconColor =
        active ? const Color(0xFFC5A059) : const Color.fromARGB(255, 255, 255, 255);

    return MouseRegion(
      onEnter: (_) => setState(() => isHovered = true),
      onExit: (_) => setState(() => isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor),
          color: backgroundColor,
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            splashColor: const Color(0xFFC5A059).withOpacity(0.25),
            highlightColor: const Color(0xFFC5A059).withOpacity(0.1),
            onTap: () async {
              setState(() => isPressed = true);
              await widget.onPressed();
              if (mounted) {
                setState(() => isPressed = false);
              }
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: 16,
                horizontal: 18,
              ),
              child: Row(
                children: [
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 180),
                    child: Icon(
                      widget.icon,
                      key: ValueKey(iconColor),
                      color: iconColor,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 180),
                      style: TextStyle(
                        color: active
                            ? const Color(0xFFC5A059)
                            : const Color(0xFF0B2E4F),
                        fontWeight: FontWeight.w600,
                      ),
                      child: Text(
  widget.title,
  style: const TextStyle(color: Colors.white),
)
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}