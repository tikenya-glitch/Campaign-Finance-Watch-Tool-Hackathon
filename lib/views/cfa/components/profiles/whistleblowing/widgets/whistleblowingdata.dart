import 'package:excel/excel.dart';
import 'package:http/http.dart' as http;

class WhistleblowingData {
  final List<FlaggedParty> highStakes; // > 1 Billion Total
  final List<FlaggedParty> watchList;  // > 13 Million in a single year
  final Map<int, double> yearlyTrends; // Total funding trends

  WhistleblowingData({required this.highStakes, required this.watchList, required this.yearlyTrends});
}

class FlaggedParty {
  final String name;
  final double amount;
  final String reason;
  final String year;

  FlaggedParty(this.name, this.amount, this.reason, this.year);
}

class WhistleblowingService {
  final String fundUrl = "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/political_parties_fund_dataset/political_parties_fund_dataset.xlsx";

  Future<WhistleblowingData> analyzeRisk() async {
    final res = await http.get(Uri.parse(fundUrl));
    var excel = Excel.decodeBytes(res.bodyBytes);
    var sheet = excel.tables[excel.tables.keys.first]!;

    Map<String, double> totalByParty = {};
    Map<int, double> yearlyTrends = {};
    List<FlaggedParty> watchList = [];

    for (var i = 1; i < sheet.maxRows; i++) {
      var row = sheet.rows[i];
      String yearStr = row[0]?.value.toString() ?? "";
      String name = row[1]?.value.toString() ?? "Unknown";
      double amount = double.tryParse(row[2]?.value.toString() ?? "0") ?? 0;
      int year = int.tryParse(yearStr.split('/').first) ?? 2024;

      // 1. Single Year Watchlist (> 13 Million)
      if (amount > 13000000) {
        watchList.add(FlaggedParty(name, amount, "Excessive Single Year Allocation", yearStr));
      }

      // 2. Accumulate Totals
      totalByParty[name] = (totalByParty[name] ?? 0) + amount;
      yearlyTrends[year] = (yearlyTrends[year] ?? 0) + amount;
    }

    // 3. High Stakes Flag (> 1 Billion)
    List<FlaggedParty> highStakes = [];
    totalByParty.forEach((name, total) {
      if (total > 1000000000) {
        highStakes.add(FlaggedParty(name, total, "Billion-Level Cumulative Funding", "All Years"));
      }
    });

    return WhistleblowingData(highStakes: highStakes, watchList: watchList, yearlyTrends: yearlyTrends);
  }
}