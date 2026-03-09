import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class CandidateRiskFlagButton extends StatelessWidget {
  const CandidateRiskFlagButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Candidate Risk Profile",
      icon: Icons.flag, onPressed: () async { return; },
    );
  }
}