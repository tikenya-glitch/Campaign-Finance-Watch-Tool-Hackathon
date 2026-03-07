import 'package:flutter/material.dart';
import 'package:trans_portal/controller/political_funds/pp_fund.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class FundsProfileButton extends StatelessWidget {
  const FundsProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Funds Profile",
      icon: Icons.account_balance_outlined,
      onPressed: () async {
        final dataService = PoliticalPartyFundService();
        final data = await dataService.fetchPoliticalFunds();
        
        if (data.isNotEmpty) {
          // Navigate to a screen to display the data or show a modal
          print("Loaded ${data.length} rows of funding data!");
        }
      },
    );
  }
}