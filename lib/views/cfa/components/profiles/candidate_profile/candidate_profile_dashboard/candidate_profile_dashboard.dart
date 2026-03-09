import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:trans_portal/controller/candidate_data_service/candidate_data_service.dart';
import 'package:trans_portal/views/cfa/components/profiles/candidate_profile/candidate_profile_dashboard/candidate_dashboard_exporter.dart';

class CandidateProfileDashboard extends StatefulWidget {
  final CandidateDashboardData data;

  const CandidateProfileDashboard({
    super.key,
    required this.data,
  });

  @override
  State<CandidateProfileDashboard> createState() =>
      _CandidateProfileDashboardState();
}

class _CandidateProfileDashboardState extends State<CandidateProfileDashboard> {
  String _selectedParty = 'All Parties';
  String _partyQuery = '';

  String _formatCurrency(double value) {
    final s = value.round().toString();
    final chars = s.split('').reversed.toList();
    final buffer = StringBuffer();

    for (int i = 0; i < chars.length; i++) {
      if (i > 0 && i % 3 == 0) {
        buffer.write(',');
      }
      buffer.write(chars[i]);
    }

    return 'KES ${buffer.toString().split('').reversed.join()}';
  }

  Future<void> _handleExport({
    required List<PartyROI> filteredROI,
    required List<CandidateRecord> filteredCandidates,
    required Map<String, int> filteredCountyDensity,
    required Map<String, int> filteredAffiliations,
    required Map<String, int> filteredPositionFocus,
  }) async {
    try {
      await CandidateDashboardExporter.export(
        data: widget.data,
        yearLabel: 'All Available Data',
        partyQuery: _partyQuery,
        visibleRoi: filteredROI,
        visibleCandidates: filteredCandidates,
        visibleCountyDensity: filteredCountyDensity,
        visibleAffiliationStats: filteredAffiliations,
        visiblePositionFocus: filteredPositionFocus,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Export downloaded successfully.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Export failed: $e'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = screenWidth >= 1150;
    final isTablet = screenWidth >= 760;
    final isSmall = screenWidth < 560;

    final allParties = widget.data.partyROI.map((e) => e.name).toSet().toList()
      ..sort();

    final filteredROI = widget.data.partyROI.where((p) {
      final partyMatch =
          _selectedParty == 'All Parties' ? true : p.name == _selectedParty;
      final queryMatch = _partyQuery.trim().isEmpty
          ? true
          : p.name.toLowerCase().contains(_partyQuery.toLowerCase());
      return partyMatch && queryMatch;
    }).toList();

    final filteredCandidates = widget.data.candidates.where((c) {
      final partyMatch =
          _selectedParty == 'All Parties' ? true : c.party == _selectedParty;
      final queryMatch = _partyQuery.trim().isEmpty
          ? true
          : c.party.toLowerCase().contains(_partyQuery.toLowerCase());
      return partyMatch && queryMatch;
    }).toList();

    final filteredCountyDensity = <String, int>{};
    for (final c in filteredCandidates) {
      filteredCountyDensity[c.county] =
          (filteredCountyDensity[c.county] ?? 0) + 1;
    }

    final filteredAffiliations = <String, int>{
      'Party': 0,
      'Independent': 0,
    };
    for (final c in filteredCandidates) {
      if (c.party.toLowerCase().contains('independent')) {
        filteredAffiliations['Independent'] =
            (filteredAffiliations['Independent'] ?? 0) + 1;
      } else {
        filteredAffiliations['Party'] =
            (filteredAffiliations['Party'] ?? 0) + 1;
      }
    }

    final filteredPositionFocus = <String, int>{};
    for (final c in filteredCandidates) {
      filteredPositionFocus[c.position] =
          (filteredPositionFocus[c.position] ?? 0) + 1;
    }

    final totalFunding =
        filteredROI.fold<double>(0, (sum, p) => sum + p.funding);
    final totalCandidates =
        filteredROI.fold<int>(0, (sum, p) => sum + p.candidates);
    final avgCostPerCandidate =
        totalCandidates > 0 ? totalFunding / totalCandidates : 0.0;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          "Candidate Insights",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0B2E4F),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: isSmall
                ? IconButton(
                    tooltip: 'Download',
                    onPressed: () => _handleExport(
                      filteredROI: filteredROI,
                      filteredCandidates: filteredCandidates,
                      filteredCountyDensity: filteredCountyDensity,
                      filteredAffiliations: filteredAffiliations,
                      filteredPositionFocus: filteredPositionFocus,
                    ),
                    icon: const Icon(Icons.download, color: Colors.white),
                  )
                : TextButton.icon(
                    onPressed: () => _handleExport(
                      filteredROI: filteredROI,
                      filteredCandidates: filteredCandidates,
                      filteredCountyDensity: filteredCountyDensity,
                      filteredAffiliations: filteredAffiliations,
                      filteredPositionFocus: filteredPositionFocus,
                    ),
                    icon: const Icon(Icons.download, color: Colors.white),
                    label: const Text(
                      'Download',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(isSmall ? 16 : 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Candidate Profile Overview',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0B2E4F),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'This dashboard explains how candidate participation, political-party funding, county concentration, and position focus interact. The visuals are designed to be clearer and easier to understand through labels, rankings, explanatory text, and export functionality.',
              style: TextStyle(
                fontSize: 15,
                height: 1.6,
                color: Color(0xFF425466),
              ),
            ),
            const SizedBox(height: 20),

            _buildFilterPanel(allParties, isSmall),
            const SizedBox(height: 20),

            Wrap(
              spacing: 16,
              runSpacing: 16,
              children: [
                _summaryCard(
                  width: isSmall ? double.infinity : 250,
                  title: 'Visible Parties',
                  value: '${filteredROI.length}',
                  subtitle:
                      'Political parties currently included after applying the party filters.',
                  color: const Color(0xFFE8F1FF),
                ),
                _summaryCard(
                  width: isSmall ? double.infinity : 250,
                  title: 'Visible Candidates',
                  value: '$totalCandidates',
                  subtitle:
                      'Total number of candidates represented in the filtered view.',
                  color: const Color(0xFFEAF8EE),
                ),
                _summaryCard(
                  width: isSmall ? double.infinity : 250,
                  title: 'Visible Funding',
                  value: _formatCurrency(totalFunding),
                  subtitle:
                      'Total funding mapped to the visible parties in the current view.',
                  color: const Color(0xFFFFF4E8),
                ),
                _summaryCard(
                  width: isSmall ? double.infinity : 250,
                  title: 'Average Cost per Candidate',
                  value: _formatCurrency(avgCostPerCandidate),
                  subtitle:
                      'Average funding per candidate across the currently visible parties.',
                  color: const Color(0xFFFFEDEE),
                ),
              ],
            ),

            const SizedBox(height: 24),

            if (isDesktop)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 3,
                    child: _chartCard(
                      title: "Funding Efficiency Matrix",
                      description:
                          "This chart compares party funding against candidate count. Each point represents one party. The horizontal axis shows total funding in KES millions, while the vertical axis shows the number of candidates. Bubble size reflects cost per candidate.",
                      chart: _buildBubbleChart(filteredROI),
                      fixedHeight: 500,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 2,
                    child: _chartCard(
                      title: "Contestation Density by County",
                      description:
                          "This ranking shows the counties with the highest concentration of candidates in the current filtered view. Longer bars indicate higher candidate density.",
                      chart: _buildContestationDensity(filteredCountyDensity),
                      fixedHeight: 500,
                    ),
                  ),
                ],
              )
            else
              Column(
                children: [
                  _chartCard(
                    title: "Funding Efficiency Matrix",
                    description:
                        "This chart compares party funding against candidate count. Each point represents one party. The horizontal axis shows total funding in KES millions, while the vertical axis shows the number of candidates. Bubble size reflects cost per candidate.",
                    chart: _buildBubbleChart(filteredROI),
                    fixedHeight: 480,
                  ),
                  const SizedBox(height: 16),
                  _chartCard(
                    title: "Contestation Density by County",
                    description:
                        "This ranking shows the counties with the highest concentration of candidates in the current filtered view. Longer bars indicate higher candidate density.",
                    chart: _buildContestationDensity(filteredCountyDensity),
                    fixedHeight: 480,
                  ),
                ],
              ),

            const SizedBox(height: 24),

            if (isTablet)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _chartCard(
                      title: "Affiliation Transparency",
                      description:
                          "This donut chart shows the balance between party-affiliated and independent candidates in the filtered results.",
                      chart: _buildDonutChart(filteredAffiliations),
                      fixedHeight: 460,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _chartCard(
                      title: "Strategic Position Focus",
                      description:
                          "This radar chart shows how candidate concentration is distributed across elective positions.",
                      chart: _buildRadarChart(filteredPositionFocus),
                      fixedHeight: 460,
                    ),
                  ),
                ],
              )
            else
              Column(
                children: [
                  _chartCard(
                    title: "Affiliation Transparency",
                    description:
                        "This donut chart shows the balance between party-affiliated and independent candidates in the filtered results.",
                    chart: _buildDonutChart(filteredAffiliations),
                    fixedHeight: 440,
                  ),
                  const SizedBox(height: 16),
                  _chartCard(
                    title: "Strategic Position Focus",
                    description:
                        "This radar chart shows how candidate concentration is distributed across elective positions.",
                    chart: _buildRadarChart(filteredPositionFocus),
                    fixedHeight: 440,
                  ),
                ],
              ),

            const SizedBox(height: 24),

            _chartCard(
              title: "Top Parties Summary Table",
              description:
                  "This table supports the visuals above by listing party funding, candidate count, and estimated cost per candidate.",
              chart: _buildPartyTable(filteredROI),
              fixedHeight: 420,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterPanel(List<String> allParties, bool isSmall) {
    final values = ['All Parties', ...allParties];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Wrap(
        spacing: 16,
        runSpacing: 16,
        children: [
          SizedBox(
            width: isSmall ? double.infinity : 320,
            child: DropdownButtonFormField<String>(
              isExpanded: true,
              value: values.contains(_selectedParty)
                  ? _selectedParty
                  : 'All Parties',
              decoration: const InputDecoration(
                labelText: 'Filter by Party',
                border: OutlineInputBorder(),
              ),
              items: values
                  .map(
                    (party) => DropdownMenuItem<String>(
                      value: party,
                      child: Text(
                        party,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedParty = value ?? 'All Parties';
                });
              },
            ),
          ),
          SizedBox(
            width: isSmall ? double.infinity : 320,
            child: TextFormField(
              initialValue: _partyQuery,
              decoration: const InputDecoration(
                labelText: 'Search Party Name',
                hintText: 'Enter full or partial party name',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                setState(() {
                  _partyQuery = value;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _summaryCard({
    required double width,
    required String title,
    required String value,
    required String subtitle,
    required Color color,
  }) {
    return SizedBox(
      width: width == double.infinity ? null : width,
      child: Container(
        constraints: const BoxConstraints(minHeight: 150),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                color: Color(0xFF0B2E4F),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              value,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0B2E4F),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 13,
                height: 1.5,
                color: Color(0xFF425466),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _chartCard({
    required String title,
    required String description,
    required Widget chart,
    double fixedHeight = 460,
  }) {
    return Container(
      width: double.infinity,
      height: fixedHeight,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: Color(0xFF0B2E4F),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              fontSize: 13,
              height: 1.5,
              color: Color(0xFF425466),
            ),
          ),
          const SizedBox(height: 12),
          const Divider(),
          const SizedBox(height: 8),
          Expanded(child: chart),
        ],
      ),
    );
  }

  Widget _buildBubbleChart(List<PartyROI> roiData) {
    if (roiData.isEmpty) {
      return const Center(
        child: Text('No data available for the selected filters.'),
      );
    }

    final cleanData = [...roiData]..sort((a, b) => b.funding.compareTo(a.funding));
    final maxFunding =
        cleanData.map((e) => e.funding).reduce((a, b) => a > b ? a : b);
    final maxCandidates =
        cleanData.map((e) => e.candidates.toDouble()).reduce((a, b) => a > b ? a : b);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'How to read this chart: parties farther to the right have more funding, parties higher up field more candidates, and larger bubbles indicate higher funding per candidate.',
          style: TextStyle(
            fontSize: 12,
            height: 1.5,
            color: Color(0xFF425466),
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: ScatterChart(
            ScatterChartData(
              minX: 0,
              minY: 0,
              maxX: maxFunding == 0 ? 10 : (maxFunding / 1000000) * 1.15,
              maxY: maxCandidates == 0 ? 10 : maxCandidates * 1.2,
              scatterSpots: cleanData.map((p) {
                final bubbleSize =
                    (p.costPerCandidate / 500000).clamp(6, 22).toDouble();

                final bubbleColor = p.costPerCandidate > 5000000
                    ? Colors.redAccent
                    : const Color(0xFF0B84F3);

                return ScatterSpot(
                  p.funding / 1000000,
                  p.candidates.toDouble(),
                  dotPainter: FlDotCirclePainter(
                    radius: bubbleSize,
                    color: bubbleColor.withOpacity(0.78),
                    strokeWidth: 1,
                    strokeColor: Colors.black12,
                  ),
                );
              }).toList(),
              scatterTouchData: ScatterTouchData(
                enabled: true,
                touchTooltipData: ScatterTouchTooltipData(
                  getTooltipItems: (spot) {
                    final match = cleanData.firstWhere(
                      (p) =>
                          (p.funding / 1000000) == spot.x &&
                          p.candidates.toDouble() == spot.y,
                      orElse: () => const PartyROI('Unknown', 0, 0),
                    );

                    return ScatterTooltipItem(
                      '${match.name}\nFunding: ${_formatCurrency(match.funding)}\nCandidates: ${match.candidates}\nCost per Candidate: ${_formatCurrency(match.costPerCandidate)}',
                      textStyle: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    );
                  },
                ),
              ),
              gridData: const FlGridData(show: true),
              borderData: FlBorderData(
                show: true,
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              titlesData: FlTitlesData(
                leftTitles: AxisTitles(
                  axisNameWidget: const Padding(
                    padding: EdgeInsets.only(bottom: 8),
                    child: Text('Candidate Count'),
                  ),
                  sideTitles: const SideTitles(showTitles: true, reservedSize: 40),
                ),
                bottomTitles: AxisTitles(
                  axisNameWidget: const Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: Text('Funding (KES Millions)'),
                  ),
                  sideTitles: const SideTitles(showTitles: true, reservedSize: 30),
                ),
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContestationDensity(Map<String, int> density) {
    if (density.isEmpty) {
      return const Center(
        child: Text('No county density data available.'),
      );
    }

    final sorted = density.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final topItems = sorted.take(10).toList();
    final maxValue = topItems.first.value.toDouble();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Counties are ranked by visible candidate volume. This helps identify where contestation is most concentrated.',
          style: TextStyle(
            fontSize: 12,
            height: 1.5,
            color: Color(0xFF425466),
          ),
        ),
        const SizedBox(height: 14),
        Expanded(
          child: ListView.separated(
            itemCount: topItems.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = topItems[index];
              final ratio = maxValue == 0 ? 0.0 : item.value / maxValue;

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '${index + 1}. ${item.key}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0B2E4F),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${item.value} candidates',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF425466),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: ratio,
                      minHeight: 14,
                      backgroundColor: const Color(0xFFFFE4E6),
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        Color(0xFFE11D48),
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDonutChart(Map<String, int> affiliationStats) {
    final total = affiliationStats.values.fold<int>(0, (a, b) => a + b);
    if (total == 0) {
      return const Center(
        child: Text('No affiliation data available.'),
      );
    }

    return Column(
      children: [
        Expanded(
          child: PieChart(
            PieChartData(
              sectionsSpace: 2,
              centerSpaceRadius: 55,
              sections: affiliationStats.entries.map((e) {
                final pct = total == 0 ? 0 : (e.value / total) * 100;
                return PieChartSectionData(
                  value: e.value.toDouble(),
                  title: '${pct.toStringAsFixed(1)}%',
                  color: e.key == "Independent"
                      ? const Color(0xFFC5A059)
                      : const Color(0xFF0B2E4F),
                  radius: 58,
                  titleStyle: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                );
              }).toList(),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 16,
          runSpacing: 8,
          children: affiliationStats.entries.map((e) {
            return Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: e.key == "Independent"
                        ? const Color(0xFFC5A059)
                        : const Color(0xFF0B2E4F),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${e.key}: ${e.value}',
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildRadarChart(Map<String, int> positionFocus) {
    final orderedPositions = [
      'President',
      'Governor',
      'Senator',
      'National Assembly',
      'Women Rep',
      'MCA',
    ];

    final values =
        orderedPositions.map((p) => (positionFocus[p] ?? 0).toDouble()).toList();

    final allZero = values.every((v) => v == 0);
    if (allZero) {
      return const Center(
        child: Text('No position-focus data available.'),
      );
    }

    final maxValue = values.reduce((a, b) => a > b ? a : b);
    final normalized = maxValue == 0
        ? values
        : values.map((v) => (v / maxValue) * 10).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Values are normalized so that positions with smaller counts remain visible and easy to compare.',
          style: TextStyle(
            fontSize: 12,
            height: 1.5,
            color: Color(0xFF425466),
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: RadarChart(
            RadarChartData(
              radarShape: RadarShape.polygon,
              tickCount: 5,
              radarBorderData: const BorderSide(color: Color(0xFFD1D5DB)),
              gridBorderData: const BorderSide(color: Color(0xFFE5E7EB)),
              titlePositionPercentageOffset: 0.18,
              ticksTextStyle: const TextStyle(
                fontSize: 10,
                color: Color(0xFF6B7280),
              ),
              tickBorderData: const BorderSide(color: Color(0xFFE5E7EB)),
              dataSets: [
                RadarDataSet(
                  dataEntries:
                      normalized.map((v) => RadarEntry(value: v)).toList(),
                  fillColor: const Color(0xFF0B84F3).withOpacity(0.25),
                  borderColor: const Color(0xFF0B84F3),
                  entryRadius: 3,
                  borderWidth: 2,
                ),
              ],
              getTitle: (index, angle) {
                return RadarChartTitle(
                  text: orderedPositions[index],
                  angle: angle,
                );
              },
              radarBackgroundColor: Colors.transparent,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPartyTable(List<PartyROI> roiData) {
    if (roiData.isEmpty) {
      return const Center(
        child: Text('No party data available.'),
      );
    }

    final sorted = [...roiData]..sort((a, b) => b.funding.compareTo(a.funding));

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(
          const Color(0xFFEAF1FF),
        ),
        columns: const [
          DataColumn(label: Text('Party')),
          DataColumn(label: Text('Funding')),
          DataColumn(label: Text('Candidates')),
          DataColumn(label: Text('Cost per Candidate')),
        ],
        rows: sorted.take(20).map((party) {
          return DataRow(
            cells: [
              DataCell(
                SizedBox(
                  width: 240,
                  child: Text(
                    party.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
              DataCell(Text(_formatCurrency(party.funding))),
              DataCell(Text('${party.candidates}')),
              DataCell(Text(_formatCurrency(party.costPerCandidate))),
            ],
          );
        }).toList(),
      ),
    );
  }
}