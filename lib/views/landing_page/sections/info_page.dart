import 'package:flutter/material.dart';

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 60),
          constraints: const BoxConstraints(maxWidth: 1200),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [

              /// LEFT CONTENT
              Expanded(
                flex: 5,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [

                    /// MAIN TITLE
                    Text(
                      "Our vision",
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),

                    SizedBox(height: 40),

                    /// SMALL HEADING
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

                    /// DESCRIPTION TEXT
                    SizedBox(
                      width: 420,
                      child: Text(
                        "Lorem ipsum dolor sit amet, sed ut putent virtute "
                       "voluptatibus. Eu lorem primis ocurreret vix. "
                        "Moderatius delicatissimi est at, ad sea illum "
                       "vidisse. Ut usu hinc vocibus, ut vim soluta "
                        "labores tincidunt, ad cum eruditi expetendis. Eum admodum ",
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.6,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 40),

              /// RIGHT IMAGE
              Expanded(
                flex: 5,
                child: Container(
                  height: 350,
                  decoration: BoxDecoration(
                    color: const Color(0xfff3f3f3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Image.asset(
                      "assets/vision_glasses.png",
                      fit: BoxFit.contain,
                    ),
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