


import 'package:flutter/material.dart';
import 'package:trans_portal/controller/candidate_data_service/candidate_data_service.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_profile/candidate_profile_dashboard/candidate_profile_dashboard.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';

class CandidateProfileButton extends StatelessWidget {
  const CandidateProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Candidate Profile",
      icon: Icons.person_outline,
      onPressed: () async {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => const Center(child: CircularProgressIndicator()),
        );

        try {
          final service = CandidateDataService();
          final dashboardData = await service.fetchAndProcessCandidateData();

          if (!context.mounted) return;
          Navigator.pop(context);

          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => CandidateProfileDashboard(data: dashboardData),
            ),
          );
        } catch (e) {
          if (!context.mounted) return;
          Navigator.pop(context);

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to load candidate insights: $e'),
            ),
          );
        }
      },
    );
  }
}