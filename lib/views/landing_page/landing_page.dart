

import 'package:flutter/material.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          
          /// Main Content
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 120, vertical: 80),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                /// Left Section
                Expanded(
                  flex: 3,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Transparency Portal",
                        style: TextStyle(
                          fontSize: 64,
                          fontWeight: FontWeight.w500,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),

                /// Right Section
                Expanded(
                  flex: 2,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [

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
                    ],
                  ),
                ),
              ],
            ),
          ),

          /// Bottom Left Geometric Shape
          Positioned(
            bottom: 0,
            left: 0,
            child: CustomPaint(
              size: const Size(220, 180),
              painter: TrianglePainter(),
            ),
          ),
        ],
      ),
    );
  }
}

class TrianglePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xffe8e1d6)
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, size.height);
    path.lineTo(size.width, size.height);
    path.lineTo(0, 0);
    path.close();

    canvas.drawPath(path, paint);

    final linePaint = Paint()
      ..color = Colors.black26
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    canvas.drawLine(
        Offset(0, size.height), Offset(size.width, size.height), linePaint);
    canvas.drawLine(
        Offset(size.width, size.height), Offset(0, 0), linePaint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}