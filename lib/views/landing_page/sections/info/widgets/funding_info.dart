import 'package:flutter/material.dart';

class FundingInfoSection extends StatefulWidget {
  const FundingInfoSection({super.key});

  @override
  State<FundingInfoSection> createState() => _FundingInfoSectionState();
}

class _FundingInfoSectionState extends State<FundingInfoSection> {
  // Keeps track of the indices of open tiles in the order they were opened
  final List<int> _openTileIndices = [0]; // Index 0 (Who must disclose) starts open
  bool _allOpen = false;

  void _handleTileToggle(int index, bool isExpanding) {
    setState(() {
      _allOpen = false; // Reset "Open All" state if user manual toggles
      if (isExpanding) {
        _openTileIndices.add(index);
        // If more than 2 are open, remove the oldest one (the first in the list)
        if (_openTileIndices.length > 2) {
          _openTileIndices.removeAt(0);
        }
      } else {
        _openTileIndices.remove(index);
      }
    });
  }

  void _openAll() {
    setState(() {
      _allOpen = true;
      _openTileIndices.clear();
      // Add all indices (0 to 4 based on your current items)
      for (int i = 0; i < 5; i++) {
        _openTileIndices.add(i);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        /// OPEN ALL LINK
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: _openAll,
            child: const Text(
              "Open all",
              style: TextStyle(
                color: Color(0xFF002D56),
                fontWeight: FontWeight.bold,
                decoration: TextDecoration.underline,
              ),
            ),
          ),
        ),
        const Divider(color: Colors.grey, thickness: 0.5),

        /// ACCORDION ITEMS
        _buildExpansionTile(
          index: 0,
          title: "Who must disclose their funding?",
          initiallyExpanded: true,
          children: [
            const Text(
              "The obligation of transparency applies to:",
              style: TextStyle(fontSize: 15, color: Color(0xFF002D56)),
            ),
            const SizedBox(height: 16),
            _buildBulletPoint("persons running for elective office (e.g., President, Governor, Senator, Member of Parliament, or Member of County Assembly), who must disclose all campaign contributions and expenditures."),
            _buildBulletPoint("political parties participating in elections, which must disclose funds received and campaign spending used to support their candidates or party campaigns."),
            _buildBulletPoint("referendum campaign committees, which must disclose the sources of funding and the expenditures used in referendum campaigns."),
            _buildBulletPoint("authorized campaign agents or committees, responsible for managing and reporting the financial transactions of a candidate or political party during the campaign period.")
          ],
        ),
        _buildExpansionTile(
          index: 1,
          title: "What funding must be reported?",
          children: [
            const Text(
              "The obligation of transparency requires reporting of:",
              style: TextStyle(fontSize: 15, color: Color(0xFF002D56)),
            ),
            const SizedBox(height: 16),
            _buildBulletPoint("monetary donations received from individuals, organizations, or other lawful sources for campaign activities."),
            _buildBulletPoint("in-kind contributions, such as goods, services, or facilities provided to support a campaign without payment."),
            _buildBulletPoint("loans or credit obtained to finance campaign activities."),
            _buildBulletPoint("contributions from political parties or affiliated organizations supporting a candidate’s campaign."),
            _buildBulletPoint("any other financial support used to finance campaign activities during the official campaign period."),
            _buildBulletPoint("expenditures made for campaign activities, including advertising, events, logistics, staff, and other campaign-related expenses."),
          ],
        ),
        _buildExpansionTile(
          index: 2,
          title: "When is the information available?",
          children: [
            const Text(
              "You can view reported campaign and political party funding data for five years. Here's a look at the deadlines.",
              style: TextStyle(fontSize: 15, color: Color(0xFF002D56)),
            ),
            const SizedBox(height: 10),
            // Nested simple bold text instead of nested tiles for clarity
            const Text("During the campaign period", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF002D56))),
            _buildBulletPoint("Candidates and political parties must keep detailed records of all campaign contributions and expenditures throughout the campaign period. These records must include the source of contributions and all campaign spending and must be available for inspection by the Independent Electoral and Boundaries Commission (IEBC)."),
            const Text("Within 21 days after party nominations", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF002D56))),
            _buildBulletPoint("Candidates who participate in political party nominations must submit a preliminary nomination campaign expenditure report to the IEBC within 21 days after the nomination exercise. This report provides an initial overview of campaign spending during the nomination stage."),
            const Text("Within 90 days after the general election", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF002D56))),
            _buildBulletPoint("Candidates, independent candidates, and political parties must submit a final campaign finance report within three months after election day. The report must include complete information on all campaign contributions and expenditures."),
          ],
        ),
        _buildExpansionTile(
          index: 3,
          title: "Who monitors political funding?",
          children: [
            const Text(
              "The responsibility for overseeing and enforcing transparency in political financing lies with:",
              style: TextStyle(fontSize: 15, color: Color(0xFF002D56)),
            ),
            const SizedBox(height: 16),
            _buildBulletPoint("The Independent Electoral and Boundaries Commission (IEBC), which supervises election campaign financing, receives financial reports from candidates and political parties, and ensures compliance with campaign finance regulations."),
            _buildBulletPoint("The Ethics and Anti-Corruption Commission (EACC), which investigates and takes action against corruption and unethical conduct in political financing, including illegal donations, misuse of funds or misuse of public resources during campaigns."),
            _buildBulletPoint("The Office of the Registrar of Political Parties (ORPP), which oversees political parties’ financial management, including party funding, donations, and audited financial reports."),
            _buildBulletPoint("The Auditor-General, who audits public funds allocated to political parties through the Political Parties Fund to ensure accountability and proper use."),
          ],
        ),
        _buildExpansionTile(index: 4, title: "Further information"),
      ],
    );
  }

  Widget _buildExpansionTile({
    required int index,
    bool initiallyExpanded = false,
    required String title,
    List<Widget> children = const [],
  }) {
    // Check if this specific tile should be open
    bool isOpen = _allOpen || _openTileIndices.contains(index);

    return Theme(
      data: ThemeData().copyWith(dividerColor: Colors.transparent),
      child: Container(
        decoration: const BoxDecoration(
          border: Border(
            bottom: BorderSide(color: Color(0xFFC5A059), width: 1.0),
          ),
        ),
        child: ExpansionTile(
          key: GlobalKey(), // Key ensures the widget rebuilds its state when isOpen changes
          initiallyExpanded: isOpen,
          onExpansionChanged: (expanding) => _handleTileToggle(index, expanding),
          title: Text(
            title,
            style: const TextStyle(
              color: Color(0xFF002D56),
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          iconColor: const Color(0xFFC5A059),
          collapsedIconColor: const Color(0xFFC5A059),
          childrenPadding: const EdgeInsets.only(bottom: 20, left: 16, right: 16),
          expandedAlignment: Alignment.topLeft,
          children: children,
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("—  ", style: TextStyle(color: Color(0xFF002D56), fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 15, height: 1.4, color: Color(0xFF002D56)),
            ),
          ),
        ],
      ),
    );
  }
}