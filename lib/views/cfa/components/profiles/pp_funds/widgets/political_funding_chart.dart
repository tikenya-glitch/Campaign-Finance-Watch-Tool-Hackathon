import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:trans_portal/model/pp_fund/pp_fund_model.dart';

class PoliticalFundingDashboard extends StatefulWidget {
  final List<List<dynamic>> rawData;

  const PoliticalFundingDashboard({super.key, required this.rawData});

  @override
  State<PoliticalFundingDashboard> createState() =>
      _PoliticalFundingDashboardState();
}

class _PoliticalFundingDashboardState extends State<PoliticalFundingDashboard> {
  late List<FundEntry> allEntries;
  List<FundEntry> filteredEntries = [];
  String searchQuery = "";
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _processInitialData();
  }

  void _processInitialData() {
    // Skip header and filter out invalid rows
    allEntries = widget.rawData
        .skip(1)
        .where((row) => row.length >= 3 && row[0] != null)
        .map((row) => FundEntry.fromCsv(row))
        .toList();
    filteredEntries = allEntries;
  }

  void _onSearchChanged(String query) {
    setState(() {
      searchQuery = query;
      if (query.isEmpty) {
        filteredEntries = allEntries;
      } else {
        filteredEntries = allEntries
            .where((e) => e.party.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = MediaQuery.of(context).size.width < 850;

    // Safety check for empty data
    if (allEntries.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text("Fund Profile")),
        body: const Center(child: Text("No valid data found in the dataset.")),
      );
    }

    final double totalFunds = filteredEntries.fold(
      0,
      (sum, item) => sum + item.amount,
    );
    final int uniqueParties = filteredEntries
        .map((e) => e.party)
        .toSet()
        .length;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FA),
      appBar: AppBar(
        title: const Text("Political Finance Watch - Dashboard"),
        backgroundColor: const Color(0xFF1A237E),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            _buildSearchHeader(),
            const SizedBox(height: 25),

            // 1. Summary Statistics Cards
            _buildStatGrid(isMobile, totalFunds, uniqueParties),
            const SizedBox(height: 25),

            // 2. Trend & Distribution Row
            if (isMobile) ...[
              _buildTrendChartCard(),
              const SizedBox(height: 25),
              _buildDistributionPieCard(),
            ] else
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _buildTrendChartCard()),
                  const SizedBox(width: 25),
                  Expanded(flex: 2, child: _buildDistributionPieCard()),
                ],
              ),

            const SizedBox(height: 25),

            // 3. Rankings List
            _buildTopPartiesListCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),
      child: TextField(
        controller: _searchController,
        onChanged: _onSearchChanged,
        decoration: const InputDecoration(
          icon: Icon(Icons.search, color: Colors.indigo),
          hintText: "Search for a Political Party...",
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 15),
        ),
      ),
    );
  }

  Widget _buildStatGrid(bool isMobile, double total, int count) {
    // Determine Latest FY Total
    List<String> years = allEntries.map((e) => e.year).toSet().toList()..sort();
    String latestYear = years.last;

    double latestTotal = allEntries
        .where((e) => e.year == latestYear)
        .fold(0, (sum, item) => sum + item.amount);

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: isMobile ? 1 : 3,
      crossAxisSpacing: 15,
      mainAxisSpacing: 15,
      childAspectRatio: isMobile ? 3.5 : 2.5,
      children: [
        _StatCard(
          "Cumulative Funding",
          "KES ${_formatCompact(total)}",
          Icons.account_balance,
          Colors.indigo,
        ),
        _StatCard(
          "Active Recipient Parties",
          "$count",
          Icons.groups,
          Colors.orange,
        ),
        _StatCard(
          "Latest FY Total ($latestYear)",
          "KES ${_formatCompact(latestTotal)}",
          Icons.event_note,
          Colors.green,
        ),
      ],
    );
  }

  Widget _buildTrendChartCard() {
    Map<String, double> yearMap = {};
    for (var e in filteredEntries) {
      yearMap[e.year] = (yearMap[e.year] ?? 0) + e.amount;
    }
    var sortedYears = yearMap.keys.toList()..sort();

    return Container(
      height: 400,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Total Funding Trend",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 30),
          Expanded(
            child: sortedYears.isEmpty
                ? const Center(child: Text("No trend data matches your search"))
                : LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      titlesData: FlTitlesData(
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (v, m) {
                              int index = v.toInt();
                              if (index < 0 || index >= sortedYears.length)
                                return const SizedBox.shrink();
                              return Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Text(
                                  sortedYears[index].substring(2, 7),
                                  style: const TextStyle(fontSize: 10),
                                ),
                              );
                            },
                          ),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 40,
                            getTitlesWidget: (v, m) => Text(_formatNumber(v)),
                          ),
                        ),
                        topTitles: const AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                        rightTitles: const AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                      ),
                      borderData: FlBorderData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          spots: List.generate(
                            sortedYears.length,
                            (i) =>
                                FlSpot(i.toDouble(), yearMap[sortedYears[i]]!),
                          ),
                          isCurved: true,
                          color: Colors.indigo,
                          barWidth: 3,
                          dotData: const FlDotData(show: true),
                          belowBarData: BarAreaData(
                            show: true,
                            color: Colors.indigo.withOpacity(0.05),
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildDistributionPieCard() {
    // Distribution for the latest year in the data
    String latest = allEntries
        .map((e) => e.year)
        .reduce((a, b) => a.compareTo(b) > 0 ? a : b);
    var latestData = allEntries.where((e) => e.year == latest).toList()
      ..sort((a, b) => b.amount.compareTo(a.amount));

    // Take top 4 and group others
    var top4 = latestData.take(4).toList();
    double othersSum = latestData
        .skip(4)
        .fold(0, (sum, item) => sum + item.amount);

    return Container(
      height: 400,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Distribution ($latest)",
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: [
                  ...top4.asMap().entries.map((entry) {
                    return PieChartSectionData(
                      value: entry.value.amount,
                      title: _formatCompact(entry.value.amount),
                      color: Colors.indigo.withOpacity(1 - (entry.key * 0.2)),
                      radius: 50,
                      titleStyle: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    );
                  }),
                  if (othersSum > 0)
                    PieChartSectionData(
                      value: othersSum,
                      title: 'Others',
                      color: Colors.grey[300],
                      radius: 45,
                      titleStyle: const TextStyle(
                        fontSize: 10,
                        color: Colors.black54,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopPartiesListCard() {
    Map<String, double> partyTotals = {};
    for (var e in filteredEntries) {
      partyTotals[e.party] = (partyTotals[e.party] ?? 0) + e.amount;
    }
    var sorted = partyTotals.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    var top10 = sorted.take(10).toList();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Top 10 Recipients (Historical)",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: top10.length,
            separatorBuilder: (_, __) => const Divider(),
            itemBuilder: (context, index) {
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.indigo[50],
                  child: Text(
                    "${index + 1}",
                    style: const TextStyle(color: Colors.indigo, fontSize: 12),
                  ),
                ),
                title: Text(
                  top10[index].key,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                trailing: Text(
                  "KES ${_formatCompact(top10[index].value)}",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              );
            },
          ),
          if (top10.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text("No parties found matching your search"),
              ),
            ),
        ],
      ),
    );
  }

  String _formatNumber(double value) {
    if (value >= 1000000000)
      return '${(value / 1000000000).toStringAsFixed(1)}B';
    if (value >= 1000000) return '${(value / 1000000).toStringAsFixed(1)}M';
    return value.toStringAsFixed(0);
  }

  String _formatCompact(double value) => NumberFormat.compact().format(value);
}

// Reusable Stat Card Component
class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard(this.title, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 30),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
                FittedBox(
                  child: Text(
                    value,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
