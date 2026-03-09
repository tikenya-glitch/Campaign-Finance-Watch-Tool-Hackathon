import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class DonorProfileDashboard extends StatelessWidget {
  final Map<String, dynamic> data;

  const DonorProfileDashboard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final partyFunding = Map<String, double>.from(data["partyFunding"] ?? {});

    final yearlyFunding = Map<int, double>.from(data["yearlyFunding"] ?? {});

    final countyDensity = Map<String, int>.from(data["countyDensity"] ?? {});

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),

      appBar: AppBar(
        title: const Text(
          "Political Finance Insights",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0B2E4F),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),

        child: Column(
          children: [
            _chartCard("Funding By Year", _buildFundingTrend(yearlyFunding)),

            const SizedBox(height: 20),

            _chartCard("Top Party Funding", _buildPartyFunding(partyFunding)),

            const SizedBox(height: 20),

            _chartCard(
              "Candidate Density by County",
              _buildCountyPie(countyDensity),
            ),
          ],
        ),
      ),
    );
  }

  Widget _chartCard(String title, Widget chart) {
    return Container(
      height: 400,
      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),

      child: Column(
        children: [
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),

          const SizedBox(height: 20),

          Expanded(child: chart),
        ],
      ),
    );
  }

  /// BAR CHART
  Widget _buildFundingTrend(Map<int, double> yearlyFunding) {
    final years = yearlyFunding.keys.toList()..sort();

    return BarChart(
      BarChartData(
        barGroups: years.map((year) {
          return BarChartGroupData(
            x: year,

            barRods: [
              BarChartRodData(
                toY: yearlyFunding[year]! / 1000000,
                color: const Color(0xFFC5A059),
                width: 18,
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  /// PARTY FUNDING BAR
  Widget _buildPartyFunding(Map<String, double> funding) {
    final topParties = funding.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final visible = topParties.take(10).toList();

    return BarChart(
      BarChartData(
        barGroups: visible.asMap().entries.map((e) {
          return BarChartGroupData(
            x: e.key,

            barRods: [
              BarChartRodData(
                toY: e.value.value / 1000000,
                width: 16,
                color: const Color(0xFF0B2E4F),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  /// PIE CHART
  Widget _buildCountyPie(Map<String, int> countyDensity) {
    final entries = countyDensity.entries.toList();

    return PieChart(
      PieChartData(
        sections: entries.map((e) {
          return PieChartSectionData(
            value: e.value.toDouble(),
            title: e.key,
            radius: 100,
          );
        }).toList(),
      ),
    );
  }
}
