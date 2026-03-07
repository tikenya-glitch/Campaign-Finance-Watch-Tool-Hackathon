import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_risk_flag_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/donor_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/donor_risk_flag_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/pp_funds/pp_funds_profile.dart';
import 'package:trans_portal/views/cfa/components/profiles/parties_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/watchlist_preview_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/whistleblowing_button.dart';

class SidebarContainer extends StatelessWidget {
  const SidebarContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: const [
          CandidateProfileButton(),
          SizedBox(height: 12),
          DonorProfileButton(),
          SizedBox(height: 12),
          PartiesProfileButton(),
          SizedBox(height: 12),
          FundsProfileButton(),
          SizedBox(height: 12),
          CandidateRiskFlagButton(),
          SizedBox(height: 12),
          WatchlistPreviewButton(),
          SizedBox(height: 12),
          DonorRiskFlagButton(),
          SizedBox(height: 12),
          WhistleblowingSidebarButton(),
        ],
      ),
    );
  }
}