import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:trans_portal/views/cfa/components/profiles/whistleblowing/widgets/whistleblowingdata.dart';

class WhistleblowingDashboard extends StatelessWidget {
  final WhistleblowingData data;
  const WhistleblowingDashboard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Whistleblowing & Risk Analysis"),
        backgroundColor: Colors.red[900],
      ),
      body: LayoutBuilder(builder: (context, constraints) {
        bool isWide = constraints.maxWidth > 900;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _buildTrendChart(),
              const SizedBox(height: 20),
              isWide
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFlagList("High Stakes (>1B)", data.highStakes),
                        _buildFlagList("Watchlist (>13M)", data.watchList)
                      ])
                  : Column(children: [
                      _buildFlagList("High Stakes (>1B)", data.highStakes),
                      _buildFlagList("Watchlist (>13M)", data.watchList)
                    ]),
            ],
          ),
        );
      }),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showReportForm(context),
        label: const Text("Report Irregularity"),
        icon: const Icon(Icons.add_alert),
        backgroundColor: Colors.red,
      ),
    );
  }

  Widget _buildTrendChart() {
    var sortedYears = data.yearlyTrends.keys.toList()..sort();
    return Container(
      height: 300,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          const Text("National Funding Trajectory (Risk Trends)",
              style: TextStyle(fontWeight: FontWeight.bold)),
          const Text(
            "Sudden upward slopes indicate high-spending election cycles.",
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
          Expanded(
            child: LineChart(LineChartData(
              lineBarsData: [
                LineChartBarData(
                  spots: sortedYears
                      .map((y) =>
                          FlSpot(y.toDouble(), data.yearlyTrends[y]! / 1000000))
                      .toList(),
                  isCurved: true,
                  color: Colors.red,
                  barWidth: 4,
                )
              ],
              titlesData: FlTitlesData(
                leftTitles:
                    AxisTitles(sideTitles: SideTitles(showTitles: true)),
                bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (v, m) =>
                            Text(v.toInt().toString()))),
              ),
            )),
          ),
        ],
      ),
    );
  }

  Widget _buildFlagList(String title, List<FlaggedParty> list) {
    return Expanded(
      child: Card(
        margin: const EdgeInsets.all(8),
        child: Column(
          children: [
            ListTile(
              title: Text(title,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, color: Colors.red)),
            ),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: list.length,
              itemBuilder: (context, i) => ListTile(
                title: Text(list[i].name),
                subtitle: Text("Year: ${list[i].year}"),
                trailing: Text(
                  "${(list[i].amount / 1000000).toStringAsFixed(1)}M",
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showReportForm(BuildContext context) {
    final subjectController = TextEditingController();
    final descriptionController = TextEditingController();
    List<PlatformFile> uploadedFiles = [];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            Future<void> pickFiles() async {
              final result = await FilePicker.platform.pickFiles(
                allowMultiple: true,
                type: FileType.custom,
                allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'],
              );

              if (result != null) {
                setState(() {
                  uploadedFiles.addAll(result.files);
                });
              }
            }

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Submit Whistleblower Report",
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),

                    const SizedBox(height: 15),

                    TextField(
                      controller: subjectController,
                      decoration: const InputDecoration(
                        labelText: "Subject Party/Candidate",
                        border: OutlineInputBorder(),
                      ),
                    ),

                    const SizedBox(height: 12),

                    TextField(
                      controller: descriptionController,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: "Description of Irregularity",
                        border: OutlineInputBorder(),
                      ),
                    ),

                    const SizedBox(height: 15),

                    /// Upload Button
                    ElevatedButton.icon(
                      onPressed: pickFiles,
                      icon: const Icon(Icons.attach_file),
                      label: const Text("Upload Supporting Files"),
                    ),

                    const SizedBox(height: 10),

                    /// Uploaded Files List
                    if (uploadedFiles.isNotEmpty)
                      Column(
                        children: uploadedFiles.map((file) {
                          return ListTile(
                            leading: const Icon(Icons.insert_drive_file),
                            title: Text(file.name),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                setState(() {
                                  uploadedFiles.remove(file);
                                });
                              },
                            ),
                          );
                        }).toList(),
                      ),

                    const SizedBox(height: 20),

                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red),
                      onPressed: () {
                        Navigator.pop(context);

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              "Report submitted with ${uploadedFiles.length} attachment(s)",
                            ),
                          ),
                        );
                      },
                      child: const Text("Submit Secure Report"),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}