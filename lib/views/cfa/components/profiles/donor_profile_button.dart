import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class DonorProfileButton extends StatelessWidget {
  const DonorProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "Donor Profile",
      icon: Icons.person_outline, onPressed: () async { return; },
    );
  }
}