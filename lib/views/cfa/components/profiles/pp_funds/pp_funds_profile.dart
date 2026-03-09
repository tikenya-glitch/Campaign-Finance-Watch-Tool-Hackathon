

import 'package:flutter/material.dart';
import 'package:trans_portal/controller/political_funds/pp_fund.dart';
import 'package:trans_portal/views/cfa/components/profiles/pp_funds/widgets/political_funding_chart.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';

class FundsProfileButton extends StatelessWidget {
  const FundsProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Funds Profile",
      icon: Icons.account_balance_outlined,
      onPressed: () async {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => const Center(child: CircularProgressIndicator()),
        );

        try {
          final dataService = PoliticalPartyFundService();
          final rawData = await dataService.fetchPoliticalFunds();

          if (context.mounted) {
            Navigator.pop(context);

            if (rawData.isNotEmpty) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => PoliticalFundingDashboard(rawData: rawData),
                ),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('No political funding data found.'),
                ),
              );
            }
          }
        } catch (e) {
          if (context.mounted) {
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to load funding data: $e')),
            );
          }
        }
      },
    );
  }
}