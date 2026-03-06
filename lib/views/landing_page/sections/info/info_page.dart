import 'package:flutter/material.dart';
import 'package:trans_portal/views/landing_page/sections/info/widgets/funding_info.dart';

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: LayoutBuilder(
        builder: (context, constraints) {
          double width = constraints.maxWidth;
          bool isMobile = width < 900; // Adjusted breakpoint for better readability

          return Align(
            alignment: Alignment.topLeft,
            child: SingleChildScrollView( // Ensures content is accessible on smaller screens
              child: Container(
                width: double.infinity,
                constraints: const BoxConstraints(maxWidth: 1400),
                padding: EdgeInsets.fromLTRB(
                  isMobile ? 20 : 60,
                  isMobile ? 40 : 80,
                  isMobile ? 20 : 60,
                  40,
                ),
                child: isMobile
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildMainTitle(isMobile),
                          const SizedBox(height: 30),
                          const _InfoDescription(),
                          const SizedBox(height: 60),
                          const FundingInfoSection(), // Replacement here
                        ],
                      )
                    : Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          /// LEFT COLUMN (Text & Good to Know)
                          Expanded(
                            flex: 5,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildMainTitle(isMobile),
                                const SizedBox(height: 40),
                                const _InfoDescription(),
                              ],
                            ),
                          ),
                          const SizedBox(width: 80),
                          /// RIGHT COLUMN (The FAQ Accordion)
                          const Expanded(
                            flex: 6,
                            child: FundingInfoSection(), // Replacement here
                          ),
                        ],
                      ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMainTitle(bool isMobile) {
    return Text(
      isMobile ? "Info" : "Information",
      style: TextStyle(
        fontSize: isMobile ? 38 : 64,
        fontWeight: FontWeight.bold,
        color: Colors.black,
        height: 1.1,
      ),
    );
  }
}

class _InfoDescription extends StatelessWidget {
  const _InfoDescription();

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 500),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Transparency of political funding in Kenya.",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 24),
          const Text(
             "Citizens can now discover who funds the political parties represented in Parliament, how much they receive, "
           "and where that money originates. This tool provides a comprehensive look at the financing behind federal "
           "election campaigns, providing an overview of the new transparency obligations for political parties and "
           "a guide on how you can access this vital information.",
            style: TextStyle(fontSize: 16, height: 1.7, color: Color(0xFF4A4A4A)),
          ),
          const SizedBox(height: 40),
          
          /// THE "GOOD TO KNOW" BOX
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF002D56),
              border: Border.all(color: const Color(0xFFC5A059), width: 1.5),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Good to know", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                SizedBox(height: 20),
                Text(
                  "The transparency obligation applied for the first time in connection with the 2023 federal election.",
                  style: TextStyle(color: Colors.white, fontSize: 16, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}