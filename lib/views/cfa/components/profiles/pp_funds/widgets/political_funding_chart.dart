import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/profiles/pp_funds/widgets/political_funding_overview.dart';

class PoliticalFundingDashboard extends StatelessWidget {
  final List<dynamic> rawData;

  const PoliticalFundingDashboard({
    super.key,
    required this.rawData,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Color(0xFF0B2E4F),
        foregroundColor: const Color.fromARGB(255, 244, 244, 244),
        title: const Text(
          'Political Funding Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: SafeArea(
        child: PoliticalFundingOverview(rawData: rawData),
      ),
    );
  }
}