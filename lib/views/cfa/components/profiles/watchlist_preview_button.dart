import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/widgets/sidebar_button.dart';


class WatchlistPreviewButton extends StatelessWidget {
  const WatchlistPreviewButton({super.key});

  @override
  Widget build(BuildContext context) {
    return  SidebarButton(
      title: "WatchList Profile",
      icon: Icons.visibility, onPressed: () async { return; },
    );
  }
}