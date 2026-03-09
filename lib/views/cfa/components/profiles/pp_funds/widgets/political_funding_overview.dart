import 'package:flutter/material.dart';

enum DashboardViewMode { overall, singleYear }

class FundEntry {
  final String year;
  final String party;
  final double amount;

  FundEntry({
    required this.year,
    required this.party,
    required this.amount,
  });

  factory FundEntry.fromRow(dynamic row) {
    if (row is List && row.length >= 3) {
      return FundEntry(
        year: row[0]?.toString().trim() ?? '',
        party: row[1]?.toString().trim() ?? 'Unknown',
        amount: double.tryParse(
              row[2]?.toString().replaceAll(RegExp(r'[^0-9.]'), '') ?? '0',
            ) ??
            0.0,
      );
    }

    if (row is Map<String, dynamic>) {
      return FundEntry(
        year: row['financial_year']?.toString().trim() ??
            row['year']?.toString().trim() ??
            '',
        party: row['party_name']?.toString().trim() ??
            row['party']?.toString().trim() ??
            'Unknown',
        amount: ((row['amount_kes'] ?? row['amount']) as num?)?.toDouble() ?? 0.0,
      );
    }

    return FundEntry(year: '', party: 'Unknown', amount: 0);
  }
}

class PoliticalFundingOverview extends StatefulWidget {
  final List<dynamic> rawData;

  const PoliticalFundingOverview({
    super.key,
    required this.rawData,
  });

  @override
  State<PoliticalFundingOverview> createState() =>
      _PoliticalFundingOverviewState();
}

class _PoliticalFundingOverviewState extends State<PoliticalFundingOverview> {
  DashboardViewMode _viewMode = DashboardViewMode.overall;
  String _selectedYear = 'All Years';
  String _partyQuery = '';

  String formatKes(double value) {
    final fixed = value.round().toString();
    final chars = fixed.split('').reversed.toList();
    final buffer = StringBuffer();

    for (int i = 0; i < chars.length; i++) {
      if (i > 0 && i % 3 == 0) {
        buffer.write(',');
      }
      buffer.write(chars[i]);
    }

    return 'KES ${buffer.toString().split('').reversed.join()}';
  }

  @override
  Widget build(BuildContext context) {
    final allEntries = widget.rawData
        .map((e) => FundEntry.fromRow(e))
        .where((e) => e.year.isNotEmpty && e.party.isNotEmpty)
        .toList();

    final years = allEntries.map((e) => e.year).toSet().toList()..sort();

    final filteredEntries = allEntries.where((entry) {
      final matchesYear = _selectedYear == 'All Years'
          ? true
          : entry.year == _selectedYear;
      final matchesParty = _partyQuery.trim().isEmpty
          ? true
          : entry.party.toLowerCase().contains(_partyQuery.toLowerCase());
      return matchesYear && matchesParty;
    }).toList();

    final entriesForGraphs = _viewMode == DashboardViewMode.overall
        ? filteredEntries
        : filteredEntries.where((e) => e.year == _selectedYear).toList();

    final totalFunding =
        entriesForGraphs.fold<double>(0, (sum, e) => sum + e.amount);
    final uniqueParties = entriesForGraphs.map((e) => e.party).toSet().length;
    final uniqueYears = entriesForGraphs.map((e) => e.year).toSet().length;

    final fundingByYear = <String, double>{};
    for (final entry in filteredEntries) {
      fundingByYear.update(
        entry.year,
        (value) => value + entry.amount,
        ifAbsent: () => entry.amount,
      );
    }

    final fundingByParty = <String, double>{};
    for (final entry in entriesForGraphs) {
      fundingByParty.update(
        entry.party,
        (value) => value + entry.amount,
        ifAbsent: () => entry.amount,
      );
    }

    final sortedYears = fundingByYear.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    final sortedParties = fundingByParty.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final peakYear = sortedYears.isEmpty
        ? const MapEntry('', 0.0)
        : sortedYears.reduce((a, b) => a.value >= b.value ? a : b);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Political Party Funding Dashboard',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0B2E4F),
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'This dashboard presents political party funding data in a more readable and analytical format. '
            'It combines filters, graphs, rankings, and explanatory notes so the information is easier to understand. '
            'Use the controls below to narrow the data by year, search for a political party, or switch between an overall historical view and a single-year view.',
            style: TextStyle(
              fontSize: 15,
              height: 1.6,
              color: Color(0xFF425466),
            ),
          ),
          const SizedBox(height: 24),

          _FilterPanel(
            years: years,
            selectedYear: _selectedYear,
            partyQuery: _partyQuery,
            viewMode: _viewMode,
            onYearChanged: (value) {
              setState(() {
                _selectedYear = value!;
              });
            },
            onPartyChanged: (value) {
              setState(() {
                _partyQuery = value;
              });
            },
            onModeChanged: (value) {
              setState(() {
                _viewMode = value;
                if (_viewMode == DashboardViewMode.singleYear &&
                    _selectedYear == 'All Years' &&
                    years.isNotEmpty) {
                  _selectedYear = years.last;
                }
              });
            },
          ),

          const SizedBox(height: 24),

          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: [
              _SummaryCard(
                title: 'Total Recorded Funding',
                value: formatKes(totalFunding),
                subtitle:
                    'The combined value of all funding records currently visible under the selected filters and view mode.',
                color: const Color(0xFFE8F1FF),
              ),
              _SummaryCard(
                title: 'Parties in View',
                value: '$uniqueParties',
                subtitle:
                    'The number of unique political parties represented in the filtered dataset currently being displayed.',
                color: const Color(0xFFEAF8EE),
              ),
              _SummaryCard(
                title: 'Years in View',
                value: '$uniqueYears',
                subtitle:
                    'The number of distinct financial years included in the current visual analysis.',
                color: const Color(0xFFFFF4E8),
              ),
              _SummaryCard(
                title: 'Peak Funding Year',
                value: peakYear.key.isEmpty
                    ? '-'
                    : '${peakYear.key}\n${formatKes(peakYear.value)}',
                subtitle:
                    'The year with the largest total recorded amount in the currently filtered dataset.',
                color: const Color(0xFFFFEDEE),
              ),
            ],
          ),

          const SizedBox(height: 28),

          if (_viewMode == DashboardViewMode.overall) ...[
            _SectionCard(
              title: 'Funding Trend by Financial Year',
              description:
                  'This graph shows total allocations by financial year. It is useful for understanding the broader funding trend over time. '
                  'Each bar is labelled with the exact KES amount so users do not need to estimate from the bar length alone.',
              child: _BarGraph(
                items: sortedYears
                    .map((e) => _GraphItem(label: e.key, value: e.value))
                    .toList(),
                formatter: formatKes,
                color: const Color(0xFF356AE6),
              ),
            ),
            const SizedBox(height: 24),
          ],

          _SectionCard(
            title: _viewMode == DashboardViewMode.overall
                ? 'Top Political Parties by Total Funding'
                : 'Political Parties in Selected Year',
            description: _viewMode == DashboardViewMode.overall
                ? 'This graph ranks parties according to the total amount they have received across all currently visible records. '
                  'This makes it easy to identify which parties account for the largest share of political funding over time.'
                : 'This graph ranks parties according to the amount recorded in the selected financial year only. '
                  'It helps the user focus on the current or chosen year without the influence of historical totals.',
            child: _BarGraph(
              items: sortedParties
                  .take(10)
                  .map((e) => _GraphItem(label: e.key, value: e.value))
                  .toList(),
              formatter: formatKes,
              color: const Color(0xFF0B84F3),
            ),
          ),

          const SizedBox(height: 24),

          _SectionCard(
            title: 'Detailed Interpretation',
            description:
                'This section explains how to read the charts and what the filtered results mean in plain language.',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _NarrativePoint(
                  text:
                      'The dashboard uses clear labels, exact figures, and rankings to make the funding data easier to interpret than a chart without annotations.',
                ),
                _NarrativePoint(
                  text: _viewMode == DashboardViewMode.overall
                      ? 'You are currently in Overall View, which means the dashboard summarises funding patterns across all years currently included by the active filters.'
                      : 'You are currently in Single Year View, which means the dashboard focuses on one financial year only for party-level comparison.',
                ),
                _NarrativePoint(
                  text: _selectedYear == 'All Years'
                      ? 'No single year has been selected, so the analysis includes all years unless restricted by the current view mode.'
                      : 'The currently selected year is $_selectedYear, so the results are narrowed to records from that financial year where applicable.',
                ),
                _NarrativePoint(
                  text: _partyQuery.trim().isEmpty
                      ? 'No party name filter is active, so all matching political parties are included.'
                      : 'The party search filter is active for "$_partyQuery", meaning only matching party names are included in the visible results.',
                ),
                _NarrativePoint(
                  text:
                      'The top-party graph helps reveal whether funding is broadly distributed or concentrated among a smaller number of parties.',
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          _SectionCard(
            title: 'Filtered Data Table',
            description:
                'The table below lists the records currently included in the dashboard under the selected filters. '
                'This improves transparency by allowing users to inspect the exact rows behind the graphs and summary figures.',
            child: _FundingDataTable(
              entries: entriesForGraphs,
              formatter: formatKes,
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterPanel extends StatelessWidget {
  final List<String> years;
  final String selectedYear;
  final String partyQuery;
  final DashboardViewMode viewMode;
  final ValueChanged<String?> onYearChanged;
  final ValueChanged<String> onPartyChanged;
  final ValueChanged<DashboardViewMode> onModeChanged;

  const _FilterPanel({
    required this.years,
    required this.selectedYear,
    required this.partyQuery,
    required this.viewMode,
    required this.onYearChanged,
    required this.onPartyChanged,
    required this.onModeChanged,
  });

  @override
  Widget build(BuildContext context) {
    final dropdownItems = ['All Years', ...years];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE3EAF2)),
      ),
      child: Wrap(
        spacing: 16,
        runSpacing: 16,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          SizedBox(
            width: 220,
            child: DropdownButtonFormField<String>(
              value: dropdownItems.contains(selectedYear)
                  ? selectedYear
                  : 'All Years',
              decoration: const InputDecoration(
                labelText: 'Filter by Financial Year',
                border: OutlineInputBorder(),
              ),
              items: dropdownItems
                  .map(
                    (year) => DropdownMenuItem(
                      value: year,
                      child: Text(year),
                    ),
                  )
                  .toList(),
              onChanged: onYearChanged,
            ),
          ),
          SizedBox(
            width: 260,
            child: TextFormField(
              initialValue: partyQuery,
              decoration: const InputDecoration(
                labelText: 'Search Political Party',
                hintText: 'Enter party name',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: onPartyChanged,
            ),
          ),
          SegmentedButton<DashboardViewMode>(
            segments: const [
              ButtonSegment(
                value: DashboardViewMode.overall,
                label: Text('Overall View'),
                icon: Icon(Icons.stacked_bar_chart_outlined),
              ),
              ButtonSegment(
                value: DashboardViewMode.singleYear,
                label: Text('Single Year View'),
                icon: Icon(Icons.calendar_view_month_outlined),
              ),
            ],
            selected: {viewMode},
            onSelectionChanged: (selection) {
              onModeChanged(selection.first);
            },
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final Color color;

  const _SummaryCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0B2E4F),
              ),
            ),
            const SizedBox(height: 12),
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
}

class _SectionCard extends StatelessWidget {
  final String title;
  final String description;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.description,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE3EAF2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0B2E4F),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Color(0xFF425466),
            ),
          ),
          const SizedBox(height: 20),
          child,
        ],
      ),
    );
  }
}

class _GraphItem {
  final String label;
  final double value;

  _GraphItem({
    required this.label,
    required this.value,
  });
}

class _BarGraph extends StatelessWidget {
  final List<_GraphItem> items;
  final String Function(double) formatter;
  final Color color;

  const _BarGraph({
    required this.items,
    required this.formatter,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Text(
        'No data available for the selected filters.',
        style: TextStyle(color: Color(0xFF425466)),
      );
    }

    final maxValue = items
        .map((e) => e.value)
        .reduce((a, b) => a > b ? a : b);

    return Column(
      children: items.map((item) {
        final progress = maxValue == 0 ? 0.0 : item.value / maxValue;

        return Padding(
          padding: const EdgeInsets.only(bottom: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0B2E4F),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                formatter(item.value),
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF425466),
                ),
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  minHeight: 16,
                  value: progress,
                  backgroundColor: const Color(0xFFE7EEF7),
                  valueColor: AlwaysStoppedAnimation<Color>(color),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

class _NarrativePoint extends StatelessWidget {
  final String text;

  const _NarrativePoint({
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 4),
            child: Icon(
              Icons.check_circle_outline,
              size: 18,
              color: Color(0xFF0B84F3),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                height: 1.6,
                color: Color(0xFF425466),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FundingDataTable extends StatelessWidget {
  final List<FundEntry> entries;
  final String Function(double) formatter;

  const _FundingDataTable({
    required this.entries,
    required this.formatter,
  });

  @override
  Widget build(BuildContext context) {
    if (entries.isEmpty) {
      return const Text(
        'No records match the selected filters.',
        style: TextStyle(color: Color(0xFF425466)),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStateProperty.all(
          const Color(0xFFEAF1FF),
        ),
        columns: const [
          DataColumn(label: Text('Financial Year')),
          DataColumn(label: Text('Political Party')),
          DataColumn(label: Text('Amount (KES)')),
        ],
        rows: entries.map((e) {
          return DataRow(
            cells: [
              DataCell(Text(e.year)),
              DataCell(SizedBox(width: 280, child: Text(e.party))),
              DataCell(Text(formatter(e.amount))),
            ],
          );
        }).toList(),
      ),
    );
  }
}