import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class DonorRiskFlagButton extends StatelessWidget {
  const DonorRiskFlagButton({super.key});

  @override
  Widget build(BuildContext context) {
    return  SidebarButton(
      title: "Donor Risk Flag",
      icon: Icons.warning, onPressed: () async { return; },
    );
  }
}