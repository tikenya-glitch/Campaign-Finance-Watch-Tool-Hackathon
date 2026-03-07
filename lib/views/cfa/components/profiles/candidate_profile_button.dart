import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class CandidateProfileButton extends StatelessWidget {
  const CandidateProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Candidate Profile",
      icon: Icons.person_outline, onPressed: () async { return; }, 
    );
  }
}