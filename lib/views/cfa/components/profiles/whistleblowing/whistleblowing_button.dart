import 'package:flutter/material.dart';
import 'package:trans_portal/model/party_profile/politicaldataservice.dart';
import 'package:trans_portal/views/cfa/components/profiles/whistleblowing/widgets/whistleblowingdashboard.dart';
import 'package:trans_portal/views/cfa/components/profiles/whistleblowing/widgets/whistleblowingdata.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';

class WhistleblowingSidebarButton extends StatelessWidget {
  const WhistleblowingSidebarButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Whistleblowing",
      icon: Icons.campaign,
      onPressed: () async {
        showDialog(context: context, builder: (_) => const Center(child: CircularProgressIndicator()));
        
        final service = WhistleblowingService();
        final data = await service.analyzeRisk();
        
        if (context.mounted) {
          Navigator.pop(context); // Close loading
          Navigator.push(context, MaterialPageRoute(builder: (_) => WhistleblowingDashboard(data: data)));
        }
      },
    );
  }
}