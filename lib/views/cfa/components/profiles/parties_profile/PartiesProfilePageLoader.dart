import 'package:flutter/material.dart';
import 'package:trans_portal/controller/political_parties/political_parties_services.dart';
import 'package:trans_portal/model/party_profile/party_profile.dart';

import 'package:trans_portal/views/cfa/components/profiles/parties_profile/parties_profile_button.dart';


class PartiesProfilePageLoader extends StatelessWidget {
  const PartiesProfilePageLoader({super.key});

  @override
  Widget build(BuildContext context) {
    final service = ExcelPoliticalService();

    return FutureBuilder<List<PartyProfile>>(
      future: service.getMergedData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (snapshot.hasError) {
          return Scaffold(
            body: Center(
              child: Text('Failed to load party data: ${snapshot.error}'),
            ),
          );
        }

        final profiles = snapshot.data ?? [];

        return PartiesProfileScreen(profiles: profiles);
      },
    );
  }
}