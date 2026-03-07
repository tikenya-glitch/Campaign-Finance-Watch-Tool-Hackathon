
// --- DATA MODEL ---
class FundEntry {
  final String year;
  final String party;
  final double amount;

  FundEntry({required this.year, required this.party, required this.amount});

  factory FundEntry.fromCsv(List<dynamic> row) {
    return FundEntry(
      year: row[0]?.toString() ?? "",
      party: row[1]?.toString().trim() ?? "Unknown",
      // Clean the amount string in case Excel adds symbols
      amount: double.tryParse(row[2]?.toString().replaceAll(RegExp(r'[^0-9.]'), '') ?? '0') ?? 0.0,
    );
  }
}