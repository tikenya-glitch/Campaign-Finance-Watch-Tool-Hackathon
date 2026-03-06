import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1200),
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 60),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              /// Top Section
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  /// Left Large Title
                  Expanded(
                    flex: 2,
                    child: Text(
                      "About us",
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),

                  /// Right Description
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [

                        Text(
                          "A FEW WORDS\nABOUT US",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                          ),
                        ),

                        SizedBox(height: 12),

                        Text(
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                          "Vestibulum viverra, mauris vel facilisis fermentum, "
                          "lectus elit facilisis nulla, vel luctus nunc nisl "
                          "vel lorem.",
                          style: TextStyle(
                            fontSize: 14,
                            height: 1.6,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 60),

              /// Image Section
              Container(
                height: 320,
                width: double.infinity,
                color: const Color(0xfff2f2f2),
                child: Center(
                  child: Image.network(
                    "https://images.unsplash.com/photo-1510557880182-3b6b0b6c1d28",
                    height: 220,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}