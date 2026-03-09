import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:trans_portal/model/party_profile/party_profile.dart';
import 'package:trans_portal/views/cfa/components/profiles/parties_profile/parties_profile_dashboard/parties_profile_exporter.dart';

class PartiesProfileScreen extends StatefulWidget {
  final List<PartyProfile> profiles;

  const PartiesProfileScreen({
    super.key,
    required this.profiles,
  });

  @override
  State<PartiesProfileScreen> createState() => _PartiesProfileScreenState();
}

class _PartiesProfileScreenState extends State<PartiesProfileScreen> {
  final TextEditingController _searchController = TextEditingController();
  final NumberFormat _currencyFormat = NumberFormat('#,##0');

  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _formatKes(double value) {
    return 'KES ${_currencyFormat.format(value.round())}';
  }

  List<PartyProfile> get _filteredProfiles {
    if (_searchQuery.trim().isEmpty) return widget.profiles;

    final q = _searchQuery.toLowerCase();
    return widget.profiles.where((p) {
      return p.name.toLowerCase().contains(q) ||
          p.location.toLowerCase().contains(q);
    }).toList();
  }

  Future<void> _handleExport() async {
    try {
      await PartiesProfileExporter.export(
        profiles: _filteredProfiles,
        searchQuery: _searchQuery,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Export downloaded successfully.')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Export failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final profiles = _filteredProfiles;

    final avgCompleteness = profiles.isEmpty
        ? 0.0
        : profiles
                .map((p) => p.completenessScore)
                .reduce((a, b) => a + b) /
            profiles.length;

    final totalFunding =
        profiles.fold<double>(0, (sum, p) => sum + p.totalFunding);

    final avgAge = profiles.isEmpty
        ? 0.0
        : profiles.map((p) => p.age).reduce((a, b) => a + b) / profiles.length;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text(
          'Political Parties Insights',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0B2E4F),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            tooltip: 'Download',
            onPressed: _handleExport,
            icon: const Icon(Icons.download, color: Colors.white),
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.maxWidth;
          final isDesktop = width >= 1150;
          final isTablet = width >= 760;
          final isSmall = width < 560;

          return SingleChildScrollView(
            padding: EdgeInsets.all(isSmall ? 16 : 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Political Parties Profile Overview',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0B2E4F),
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'This dashboard brings together political party registry information and funding records to help compare party age, funding access, registration trends, registry completeness, and headquarters concentration.',
                  style: TextStyle(
                    fontSize: 15,
                    height: 1.6,
                    color: Color(0xFF425466),
                  ),
                ),
                const SizedBox(height: 20),

                _buildFilterPanel(isSmall),
                const SizedBox(height: 20),

                Wrap(
                  spacing: 16,
                  runSpacing: 16,
                  children: [
                    _summaryCard(
                      width: isSmall ? width - 32 : 250,
                      title: 'Visible Parties',
                      value: '${profiles.length}',
                      subtitle:
                          'Political parties currently included after applying the search filter.',
                      color: const Color(0xFFE8F1FF),
                    ),
                    _summaryCard(
                      width: isSmall ? width - 32 : 250,
                      title: 'Total Recorded Funding',
                      value: _formatKes(totalFunding),
                      subtitle:
                          'Total funding mapped to the visible parties from the funding dataset.',
                      color: const Color(0xFFEAF8EE),
                    ),
                    _summaryCard(
                      width: isSmall ? width - 32 : 250,
                      title: 'Average Party Age',
                      value: avgAge.toStringAsFixed(1),
                      subtitle:
                          'Average age of visible parties based on registration year.',
                      color: const Color(0xFFFFF4E8),
                    ),
                    _summaryCard(
                      width: isSmall ? width - 32 : 250,
                      title: 'Average Completeness',
                      value: '${avgCompleteness.toStringAsFixed(1)}%',
                      subtitle:
                          'Average registry completeness score for the visible parties.',
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
                        child: _chartContainer(
                          title: 'Party Age vs Funding Access',
                          description:
                              'Each point represents a party. The horizontal axis shows party age in years, while the vertical axis shows total recorded funding in KES millions.',
                          chart: _buildScatterChart(profiles),
                          fixedHeight: 480,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _chartContainer(
                          title: 'Registrations by Year',
                          description:
                              'This bar chart shows how many visible parties were registered in each year.',
                          chart: _buildBarChart(profiles),
                          fixedHeight: 480,
                        ),
                      ),
                    ],
                  )
                else ...[
                  _chartContainer(
                    title: 'Party Age vs Funding Access',
                    description:
                        'Each point represents a party. The horizontal axis shows party age in years, while the vertical axis shows total recorded funding in KES millions.',
                    chart: _buildScatterChart(profiles),
                    fixedHeight: 460,
                  ),
                  const SizedBox(height: 16),
                  _chartContainer(
                    title: 'Registrations by Year',
                    description:
                        'This bar chart shows how many visible parties were registered in each year.',
                    chart: _buildBarChart(profiles),
                    fixedHeight: 460,
                  ),
                ],

                const SizedBox(height: 24),

                if (isTablet)
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: _chartContainer(
                          title: 'Registry Completeness Score',
                          description:
                              'This indicator summarises how complete party registry records are.',
                          chart: _buildRadialScore(profiles),
                          fixedHeight: 430,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _chartContainer(
                          title: 'Headquarters Distribution',
                          description:
                              'This chart compares parties headquartered in Nairobi against those headquartered elsewhere.',
                          chart: _buildHQDistribution(profiles),
                          fixedHeight: 430,
                        ),
                      ),
                    ],
                  )
                else ...[
                  _chartContainer(
                    title: 'Registry Completeness Score',
                    description:
                        'This indicator summarises how complete party registry records are.',
                    chart: _buildRadialScore(profiles),
                    fixedHeight: 420,
                  ),
                  const SizedBox(height: 16),
                  _chartContainer(
                    title: 'Headquarters Distribution',
                    description:
                        'This chart compares parties headquartered in Nairobi against those headquartered elsewhere.',
                    chart: _buildHQDistribution(profiles),
                    fixedHeight: 420,
                  ),
                ],

                const SizedBox(height: 24),

                _chartContainer(
                  title: 'Visible Parties Table',
                  description:
                      'This table lists registration year, location, funding, age, and completeness for the visible parties.',
                  chart: _buildPartyTable(profiles),
                  fixedHeight: 430,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterPanel(bool isSmall) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: SizedBox(
        width: isSmall ? double.infinity : 320,
        child: TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            labelText: 'Search Party or Location',
            hintText: 'Enter party name or location',
            prefixIcon: Icon(Icons.search),
            border: OutlineInputBorder(),
          ),
          onChanged: (value) {
            setState(() {
              _searchQuery = value;
            });
          },
        ),
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
      width: width,
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

  Widget _chartContainer({
    required String title,
    required String description,
    required Widget chart,
    double fixedHeight = 450,
  }) {
    return SizedBox(
      width: double.infinity,
      height: fixedHeight,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
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
                fontSize: 16,
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
      ),
    );
  }

  Widget _buildScatterChart(List<PartyProfile> profiles) {
    if (profiles.isEmpty) {
      return const Center(
        child: Text('No party data available for the selected filter.'),
      );
    }

    final maxAge = profiles
        .map((p) => p.age.toDouble())
        .reduce((a, b) => a > b ? a : b);

    final maxFunding = profiles
        .map((p) => p.totalFunding / 1000000)
        .reduce((a, b) => a > b ? a : b);

    return ScatterChart(
      ScatterChartData(
        minX: 0,
        minY: 0,
        maxX: maxAge == 0 ? 5 : maxAge + 2,
        maxY: maxFunding == 0 ? 5 : maxFunding * 1.15,
        scatterSpots: profiles.map((p) {
          return ScatterSpot(
            p.age.toDouble(),
            p.totalFunding / 1000000,
            dotPainter: FlDotCirclePainter(
              radius: 7,
              color: p.totalFunding > 0
                  ? const Color(0xFF0B84F3).withOpacity(0.8)
                  : const Color(0xFFC5A059).withOpacity(0.8),
            ),
          );
        }).toList(),
        scatterTouchData: ScatterTouchData(
          enabled: true,
          touchTooltipData: ScatterTouchTooltipData(
            getTooltipItems: (spot) {
              PartyProfile? match;

              for (final p in profiles) {
                final xMatches = (p.age.toDouble() - spot.x).abs() < 0.001;
                final yMatches =
                    ((p.totalFunding / 1000000) - spot.y).abs() < 0.001;

                if (xMatches && yMatches) {
                  match = p;
                  break;
                }
              }

              match ??= const PartyProfile(
                name: 'Unknown',
                registrationYear: 0,
                totalFunding: 0,
                completenessScore: 0,
                location: 'Unknown',
                slogan: '',
              );

              return ScatterTooltipItem(
                '${match.name}\nAge: ${match.age} years\nFunding: ${_formatKes(match.totalFunding)}',
                textStyle: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                ),
              );
            },
          ),
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            axisNameWidget: const Text("Funding (KES Millions)"),
            sideTitles: const SideTitles(showTitles: true, reservedSize: 50),
          ),
          bottomTitles: AxisTitles(
            axisNameWidget: const Text("Party Age (Years)"),
            sideTitles: const SideTitles(showTitles: true, reservedSize: 30),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        gridData: const FlGridData(show: true),
        borderData: FlBorderData(
          show: true,
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
      ),
    );
  }

  Widget _buildBarChart(List<PartyProfile> profiles) {
    if (profiles.isEmpty) {
      return const Center(child: Text('No registration data available.'));
    }

    final yearCounts = <int, int>{};
    for (final p in profiles) {
      if (p.registrationYear > 0) {
        yearCounts[p.registrationYear] =
            (yearCounts[p.registrationYear] ?? 0) + 1;
      }
    }

    final sortedYears = yearCounts.keys.toList()..sort();
    if (sortedYears.isEmpty) {
      return const Center(child: Text('No valid registration years available.'));
    }

    final maxY =
        yearCounts.values.reduce((a, b) => a > b ? a : b).toDouble() + 1;

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxY,
        barGroups: sortedYears.asMap().entries.map((entry) {
          final chartIndex = entry.key;
          final year = entry.value;

          return BarChartGroupData(
            x: chartIndex,
            barRods: [
              BarChartRodData(
                toY: yearCounts[year]!.toDouble(),
                color: const Color(0xFFC5A059),
                width: 18,
                borderRadius: BorderRadius.circular(4),
              ),
            ],
          );
        }).toList(),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 34,
              getTitlesWidget: (value, meta) {
                final index = value.toInt();
                if (index < 0 || index >= sortedYears.length) {
                  return const SizedBox.shrink();
                }
                return Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    sortedYears[index].toString(),
                    style: const TextStyle(fontSize: 10),
                  ),
                );
              },
            ),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: true, reservedSize: 30),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        gridData: const FlGridData(show: true),
        borderData: FlBorderData(
          show: true,
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
      ),
    );
  }

  Widget _buildRadialScore(List<PartyProfile> profiles) {
    final avgCompleteness = profiles.isEmpty
        ? 0.0
        : profiles
                .map((p) => p.completenessScore)
                .reduce((a, b) => a + b) /
            profiles.length;

    final color = avgCompleteness >= 70
        ? Colors.green
        : avgCompleteness >= 40
            ? Colors.orange
            : Colors.redAccent;

    return Center(
      child: SizedBox(
        width: 220,
        height: 220,
        child: Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 190,
              height: 190,
              child: CircularProgressIndicator(
                value: avgCompleteness / 100,
                strokeWidth: 18,
                backgroundColor: Colors.grey[200],
                color: color,
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "${avgCompleteness.toStringAsFixed(1)}%",
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0B2E4F),
                  ),
                ),
                const SizedBox(height: 4),
                const Text("Avg Registry Integrity"),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHQDistribution(List<PartyProfile> profiles) {
    if (profiles.isEmpty) {
      return const Center(child: Text('No headquarters data available.'));
    }

    final areaCounts = <String, int>{};
    for (final p in profiles) {
      final area = p.location.toLowerCase().contains("nairobi")
          ? "Nairobi"
          : "Other Counties";
      areaCounts[area] = (areaCounts[area] ?? 0) + 1;
    }

    return Column(
      children: [
        SizedBox(
          height: 220,
          child: PieChart(
            PieChartData(
              sectionsSpace: 2,
              centerSpaceRadius: 45,
              sections: areaCounts.entries.map((e) {
                return PieChartSectionData(
                  value: e.value.toDouble(),
                  title: '${e.value}',
                  color: e.key == "Nairobi"
                      ? const Color(0xFF0B2E4F)
                      : const Color(0xFFC5A059),
                  radius: 90,
                  titleStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
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
          alignment: WrapAlignment.center,
          children: areaCounts.entries.map((e) {
            final color = e.key == "Nairobi"
                ? const Color(0xFF0B2E4F)
                : const Color(0xFFC5A059);

            return Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 8),
                Text('${e.key}: ${e.value}'),
              ],
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildPartyTable(List<PartyProfile> profiles) {
    if (profiles.isEmpty) {
      return const Center(child: Text('No visible parties available.'));
    }

    final sorted = [...profiles]
      ..sort((a, b) => b.totalFunding.compareTo(a.totalFunding));

    return Scrollbar(
      thumbVisibility: true,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            headingRowColor: MaterialStateProperty.all(
              const Color(0xFFEAF1FF),
            ),
            columns: const [
              DataColumn(label: Text('Party')),
              DataColumn(label: Text('Year')),
              DataColumn(label: Text('Location')),
              DataColumn(label: Text('Funding')),
              DataColumn(label: Text('Age')),
              DataColumn(label: Text('Completeness')),
            ],
            rows: sorted.take(25).map((party) {
              return DataRow(
                cells: [
                  DataCell(
                    SizedBox(
                      width: 220,
                      child: Text(
                        party.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  DataCell(Text('${party.registrationYear}')),
                  DataCell(
                    SizedBox(
                      width: 180,
                      child: Text(
                        party.location,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  DataCell(Text(_formatKes(party.totalFunding))),
                  DataCell(Text('${party.age}')),
                  DataCell(
                    Text('${party.completenessScore.toStringAsFixed(1)}%'),
                  ),
                ],
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}