import 'package:excel/excel.dart';
import 'package:http/http.dart' as http;

class PoliticalDataService {

  final String regUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/fully_registered_political_parties/fully_registered_political_parties.xlsx";

  final String fundUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/political_parties_fund_dataset/political_parties_fund_dataset.xlsx";

  final String candUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/candidates_sample/candidates_sample.xlsx";

  Future<Map<String, dynamic>> fetchAllData() async {

    final regRes = await http.get(Uri.parse(regUrl));
    final fundRes = await http.get(Uri.parse(fundUrl));
    final candRes = await http.get(Uri.parse(candUrl));

    final regExcel = Excel.decodeBytes(regRes.bodyBytes);
    final fundExcel = Excel.decodeBytes(fundRes.bodyBytes);
    final candExcel = Excel.decodeBytes(candRes.bodyBytes);

    Map<String, double> partyFunding = {};
    Map<int, double> yearlyFunding = {};
    Map<String, int> countyDensity = {};

    /// FUNDING DATA
    final fundSheet = fundExcel.tables.values.first;

    for (int i = 1; i < fundSheet.rows.length; i++) {

      final row = fundSheet.rows[i];

      if (row.length < 3) continue;

      final party = row[1]?.value.toString() ?? "";

      final rawAmount = row[2]?.value.toString() ?? "0";

      final amount = double.tryParse(
          rawAmount.replaceAll(RegExp(r'[^0-9.]'), '')
      ) ?? 0;

      final rawDate = row[0]?.value.toString() ?? "2024";

      final year = int.tryParse(
          RegExp(r'(19|20)\d{2}').firstMatch(rawDate)?.group(0) ?? "2024"
      ) ?? 2024;

      partyFunding[party] = (partyFunding[party] ?? 0) + amount;

      yearlyFunding[year] = (yearlyFunding[year] ?? 0) + amount;
    }

    /// CANDIDATE DATA
    final candSheet = candExcel.tables.values.first;

    for (int i = 1; i < candSheet.rows.length; i++) {

      final row = candSheet.rows[i];

      if (row.length < 2) continue;

      final county = row[1]?.value.toString() ?? "Unknown";

      countyDensity[county] = (countyDensity[county] ?? 0) + 1;
    }

    /// REGISTRY COUNT
    final regSheet = regExcel.tables.values.first;

    int totalParties = regSheet.rows.length;

    return {
      "partyFunding": partyFunding,
      "yearlyFunding": yearlyFunding,
      "countyDensity": countyDensity,
      "totalParties": totalParties
    };
  }
}