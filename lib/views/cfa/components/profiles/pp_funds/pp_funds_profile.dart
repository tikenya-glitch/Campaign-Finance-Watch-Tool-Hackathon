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
        // Show a loading indicator
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) =>
              const Center(child: CircularProgressIndicator()),
        );

        final dataService = PoliticalPartyFundService();
        final data = await dataService.fetchPoliticalFunds();

        if (context.mounted) {
          Navigator.pop(context); // Remove loading indicator

          if (data.isNotEmpty) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PoliticalFundingDashboard(rawData: data),
              ),
            );
          }
        }
      },
    );
  }
}
