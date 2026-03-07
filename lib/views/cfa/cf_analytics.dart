import 'package:flutter/material.dart';
import 'package:trans_portal/views/cfa/components/search_container/search_bar.dart';
import 'package:trans_portal/views/cfa/components/sidebar_container/sidebar_container.dart';
import 'package:trans_portal/views/cfa/widgets/cfa_feature_carousel_section.dart';

class CampaignFinanceAnalyticsPage extends StatelessWidget {
  const CampaignFinanceAnalyticsPage({super.key});

  static const double desktopBreakpoint = 1100;
  static const double tabletBreakpoint = 750;
  static const Color primaryBlue = Color(0xFF0B2E4F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final width = constraints.maxWidth;

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Campaign Finance Analytics',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: primaryBlue,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: width >= desktopBreakpoint
                        ? _desktopLayout()
                        : width >= tabletBreakpoint
                            ? _tabletLayout()
                            : _mobileLayout(),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _desktopLayout() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(width: 300, child: SidebarContainer()),
        const SizedBox(width: 24),
        Expanded(child: _mainContent()),
      ],
    );
  }

  Widget _tabletLayout() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(width: 250, child: SidebarContainer()),
        const SizedBox(width: 16),
        Expanded(child: _mainContent()),
      ],
    );
  }

  Widget _mobileLayout() {
    return SingleChildScrollView(
      child: Column(
        children: const [
          SidebarContainer(),
          SizedBox(height: 20),
          _MainContent(),
        ],
      ),
    );
  }

  Widget _mainContent() {
    return const _MainContent();
  }
}

class _MainContent extends StatelessWidget {
  const _MainContent();

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Column(
        children: [
          SearchBarWidget(),
          SizedBox(height: 28),
          CfaFeatureCarouselSection(),
        ],
      ),
    );
  }
}