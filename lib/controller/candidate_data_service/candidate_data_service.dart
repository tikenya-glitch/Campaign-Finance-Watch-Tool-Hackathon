import 'package:excel/excel.dart';
import 'package:http/http.dart' as http;

class CandidateRecord {
  final String county;
  final String party;
  final String position;

  const CandidateRecord({
    required this.county,
    required this.party,
    required this.position,
  });
}

class CandidateDashboardData {
  final List<PartyROI> partyROI;
  final Map<String, int> countyDensity;
  final Map<String, int> affiliationStats;
  final Map<String, Map<String, int>> positionFocusByParty;
  final Map<String, int> overallPositionFocus;
  final List<CandidateRecord> candidates;
  final Map<String, double> fundingByParty;

  const CandidateDashboardData({
    required this.partyROI,
    required this.countyDensity,
    required this.affiliationStats,
    required this.positionFocusByParty,
    required this.overallPositionFocus,
    required this.candidates,
    required this.fundingByParty,
  });
}

class PartyROI {
  final String name;
  final double funding;
  final int candidates;

  double get costPerCandidate => candidates > 0 ? funding / candidates : 0;

  const PartyROI(this.name, this.funding, this.candidates);
}

class CandidateDataService {
  final String candUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/candidates_sample/candidates_sample.xlsx";
  final String fundUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/political_parties_fund_dataset/political_parties_fund_dataset.xlsx";

  Future<CandidateDashboardData> fetchAndProcessCandidateData() async {
    final candRes = await http.get(Uri.parse(candUrl));
    final fundRes = await http.get(Uri.parse(fundUrl));

    if (candRes.statusCode != 200) {
      throw Exception('Failed to fetch candidates file: ${candRes.statusCode}');
    }
    if (fundRes.statusCode != 200) {
      throw Exception('Failed to fetch funding file: ${fundRes.statusCode}');
    }

    final candExcel = Excel.decodeBytes(candRes.bodyBytes);
    final fundExcel = Excel.decodeBytes(fundRes.bodyBytes);

    final partyCandidateCount = <String, int>{};
    final countyDensity = <String, int>{};
    final affiliationStats = <String, int>{
      "Party": 0,
      "Independent": 0,
    };
    final positionFocusByParty = <String, Map<String, int>>{};
    final overallPositionFocus = <String, int>{};
    final candidates = <CandidateRecord>[];

    final candSheet = candExcel.tables[candExcel.tables.keys.first]!;
    for (int i = 1; i < candSheet.maxRows; i++) {
      final row = candSheet.rows[i];
      if (row.isEmpty) continue;

      final county = _normalizeCounty(_cell(row, 1, fallback: "National"));
      final party = _normalizeParty(_cell(row, 3, fallback: "Unknown"));
      final position = _normalizePosition(_cell(row, 4, fallback: "Other"));

      candidates.add(
        CandidateRecord(
          county: county,
          party: party,
          position: position,
        ),
      );

      partyCandidateCount[party] = (partyCandidateCount[party] ?? 0) + 1;
      countyDensity[county] = (countyDensity[county] ?? 0) + 1;
      overallPositionFocus[position] = (overallPositionFocus[position] ?? 0) + 1;

      if (_isIndependent(party)) {
        affiliationStats["Independent"] =
            (affiliationStats["Independent"] ?? 0) + 1;
      } else {
        affiliationStats["Party"] = (affiliationStats["Party"] ?? 0) + 1;
      }

      positionFocusByParty.putIfAbsent(party, () => <String, int>{});
      positionFocusByParty[party]![position] =
          (positionFocusByParty[party]![position] ?? 0) + 1;
    }

    final fundingByParty = <String, double>{};
    final fundSheet = fundExcel.tables[fundExcel.tables.keys.first]!;
    for (int i = 1; i < fundSheet.maxRows; i++) {
      final row = fundSheet.rows[i];
      if (row.isEmpty) continue;

      final partyName = _normalizeParty(_cell(row, 1, fallback: "Unknown"));
      final amount = _parseAmount(_cell(row, 2, fallback: "0"));

      fundingByParty[partyName] = (fundingByParty[partyName] ?? 0) + amount;
    }

    final roiList = partyCandidateCount.entries.map((entry) {
      return PartyROI(
        entry.key,
        fundingByParty[entry.key] ?? 0.0,
        entry.value,
      );
    }).toList()
      ..sort((a, b) => b.funding.compareTo(a.funding));

    return CandidateDashboardData(
      partyROI: roiList,
      countyDensity: countyDensity,
      affiliationStats: affiliationStats,
      positionFocusByParty: positionFocusByParty,
      overallPositionFocus: overallPositionFocus,
      candidates: candidates,
      fundingByParty: fundingByParty,
    );
  }

  static String _cell(List<Data?> row, int index, {String fallback = ""}) {
    if (index >= row.length || row[index] == null) return fallback;
    return row[index]!.value?.toString().trim() ?? fallback;
  }

  static double _parseAmount(String raw) {
    final cleaned = raw.replaceAll(RegExp(r'[^0-9.]'), '');
    return double.tryParse(cleaned) ?? 0.0;
  }

  static bool _isIndependent(String party) {
    final p = party.toLowerCase();
    return p.contains('independent');
  }

  static String _normalizeCounty(String value) {
    final v = value.trim();
    if (v.isEmpty) return 'National';
    return v;
  }

  static String _normalizePosition(String value) {
    final v = value.trim();
    if (v.isEmpty) return 'Other';

    final lower = v.toLowerCase();
    if (lower.contains('president')) return 'President';
    if (lower.contains('governor')) return 'Governor';
    if (lower.contains('senator')) return 'Senator';
    if (lower.contains('women')) return 'Women Rep';
    if (lower.contains('national assembly') || lower == 'na' || lower.contains('mp')) {
      return 'National Assembly';
    }
    if (lower.contains('mca')) return 'MCA';

    return v;
  }

  static String _normalizeParty(String value) {
    final v = value.trim();
    if (v.isEmpty) return 'Unknown';

    return v
        .replaceAll(RegExp(r'\s+'), ' ')
        .replaceAll('&', 'and')
        .trim();
  }
}