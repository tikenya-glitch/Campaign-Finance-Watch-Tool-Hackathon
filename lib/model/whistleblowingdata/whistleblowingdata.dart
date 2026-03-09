class WhistleblowingData {
  final List<FlaggedParty> highStakes;
  final List<FlaggedParty> watchList;
  final Map<int, double> yearlyTrends;

  WhistleblowingData({
    required this.highStakes,
    required this.watchList,
    required this.yearlyTrends,
  });
}

class FlaggedParty {
  final String name;
  final double amount;
  final String reason;
  final String year;

  FlaggedParty(this.name, this.amount, this.reason, this.year);
}