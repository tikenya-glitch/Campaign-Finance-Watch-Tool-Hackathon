import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class WhistleblowingSidebarButton extends StatelessWidget {
  const WhistleblowingSidebarButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SidebarButton(
      title: "WhistleBlowing Button",
      icon: Icons.person_outline, onPressed: () async { return; },
    );
  }
}