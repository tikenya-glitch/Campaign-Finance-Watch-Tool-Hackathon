import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_profile/candidate_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_risk_flag_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/donor/donor_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/donor_risk_flag_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/pp_funds/pp_funds_profile.dart';
import 'package:trans_portal/views/cfa/components/profiles/parties_profile/parties_profile_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/watchlist_preview_button.dart';
import 'package:trans_portal/views/cfa/components/profiles/whistleblowing/whistleblowing_button.dart';

class SidebarContainer extends StatelessWidget {
  const SidebarContainer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF0B2E4F),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: const [
          SizedBox(height: 100),
          FundsProfileButton(),
          SizedBox(height: 30),
          // DonorProfileButton(),
          DonorProfileButton(),
          SizedBox(height: 30),
          CandidateProfileButton(),
          SizedBox(height: 30),
          // DonorProfileButton(),
          // SizedBox(height: 12),
          // CandidateRiskFlagButton(),
          // SizedBox(height: 12),
          // WatchlistPreviewButton(),
          // SizedBox(height: 12),
          // DonorRiskFlagButton(),
          // SizedBox(height: 12),
          WhistleblowingSidebarButton(),
        ],
      ),
    );
  }
}