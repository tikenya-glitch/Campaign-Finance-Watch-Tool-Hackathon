import 'package:flutter/material.dart';
import 'package:trans_portal/model/party_profile/politicaldataservice.dart';
import 'package:trans_portal/views/cfa/components/profiles/donor/widgets/donor_profile_dashboard.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';

class DonorProfileButton extends StatelessWidget {
  const DonorProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Parties Profile",
      icon: Icons.campaign,
      onPressed: () async {
        final service = PoliticalDataService();

        final data = await service.fetchAllData();

        if (!context.mounted) return;

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => DonorProfileDashboard(data: data),
          ),
        );
      },
    );
  }
}