import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:trans_portal/model/party_profile/party_profile.dart';

class PartiesProfileDashboard extends StatelessWidget {
  final List<PartyProfile> profiles;
  const PartiesProfileDashboard({super.key, required this.profiles});

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Political Parties Insights", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF0B2E4F),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Responsive Grid Logic
            if (width > 1100) ...[
              Row(children: [
                _chartContainer(context, "Party Age vs Funding Access (Scatter)", _buildScatterChart()),
                _chartContainer(context, "Registrations by Year (Election Cycle)", _buildBarChart()),
              ]),
              const SizedBox(height: 20),
              Row(children: [
                _chartContainer(context, "Registry Completeness Score", _buildRadialScore()),
                _chartContainer(context, "Headquarters Distribution", _buildHQDistribution()),
              ]),
            ] else ...[
              _chartContainer(context, "Party Age vs Funding Access (Scatter)", _buildScatterChart()),
              const SizedBox(height: 20),
              _chartContainer(context, "Registrations by Year (Election Cycle)", _buildBarChart()),
              const SizedBox(height: 20),
              _chartContainer(context, "Registry Completeness Score", _buildRadialScore()),
              const SizedBox(height: 20),
              _chartContainer(context, "Headquarters Distribution", _buildHQDistribution()),
            ],
          ],
        ),
      ),
    );
  }

  Widget _chartContainer(BuildContext context, String title, Widget chart) {
    return Container(
      width: MediaQuery.of(context).size.width > 1100 ? null : double.infinity,
      height: 450,
      margin: const EdgeInsets.symmetric(horizontal: 10),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0B2E4F))),
          const SizedBox(height: 20),
          SizedBox(height: 350, child: chart),
        ],
      ),
    );
  }

  // 1. SCATTER PLOT: Age vs Funding
  Widget _buildScatterChart() {
    return ScatterChart(
      ScatterChartData(
        scatterSpots: profiles.map((p) {
          return ScatterSpot(
            p.age.toDouble(),
            p.totalFunding / 1000000, // Scaling to Millions for readability
          );
        }).toList(),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            axisNameWidget: const Text("Funding (Millions KES)"),
            sideTitles: SideTitles(showTitles: true, reservedSize: 40),
          ),
          bottomTitles: AxisTitles(
            axisNameWidget: const Text("Party Age (Years)"),
            sideTitles: SideTitles(showTitles: true, reservedSize: 30),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: const FlGridData(show: true),
        borderData: FlBorderData(show: true),
      ),
    );
  }

  // 2. BAR CHART: Registrations by Year
  Widget _buildBarChart() {
    Map<int, int> yearCounts = {};
    for (var p in profiles) {
      yearCounts[p.registrationYear] = (yearCounts[p.registrationYear] ?? 0) + 1;
    }
    var sortedYears = yearCounts.keys.toList()..sort();

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: (yearCounts.values.isEmpty ? 10 : yearCounts.values.reduce((a, b) => a > b ? a : b).toDouble()) + 2,
        barGroups: sortedYears.asMap().entries.map((e) {
          return BarChartGroupData(
            x: e.value,
            barRods: [
              BarChartRodData(
                toY: yearCounts[e.value]!.toDouble(),
                color: e.value % 5 == 2 ? Colors.redAccent : const Color(0xFFC5A059), // Highlight election cycles
                width: 16,
              )
            ],
          );
        }).toList(),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, m) => Text(v.toInt().toString(), style: const TextStyle(fontSize: 10)))),
          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
      ),
    );
  }

  // 3. RADIAL CHART: Completeness Score
  Widget _buildRadialScore() {
    double avgCompleteness = profiles.isEmpty 
      ? 0 
      : profiles.map((p) => p.completenessScore).reduce((a, b) => a + b) / profiles.length;

    return Center(
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            width: 200,
            height: 200,
            child: CircularProgressIndicator(
              value: avgCompleteness / 100,
              strokeWidth: 20,
              backgroundColor: Colors.grey[200],
              color: avgCompleteness > 70 ? Colors.green : Colors.orange,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("${avgCompleteness.toInt()}%", style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold)),
              const Text("Avg Registry Integrity"),
            ],
          )
        ],
      ),
    );
  }

  // 4. HQ DISTRIBUTION: Hub Insights
  Widget _buildHQDistribution() {
    Map<String, int> areaCounts = {};
    for (var p in profiles) {
      String area = p.location.toLowerCase().contains("nairobi") ? "Nairobi" : "Other Counties";
      areaCounts[area] = (areaCounts[area] ?? 0) + 1;
    }

    return PieChart(
      PieChartData(
        sections: areaCounts.entries.map((e) {
          return PieChartSectionData(
            value: e.value.toDouble(),
            title: "${e.key}\n${e.value}",
            color: e.key == "Nairobi" ? const Color(0xFF0B2E4F) : const Color(0xFFC5A059),
            radius: 100,
            titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
          );
        }).toList(),
      ),
    );
  }
}