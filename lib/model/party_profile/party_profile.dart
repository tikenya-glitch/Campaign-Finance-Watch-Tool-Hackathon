class PartyProfile {
  final String name;
  final int registrationYear;
  final double totalFunding;
  final double completenessScore;
  final String location;
  final String slogan;

  const PartyProfile({
    required this.name,
    required this.registrationYear,
    required this.totalFunding,
    required this.completenessScore,
    required this.location,
    required this.slogan,
  });

  int get age {
    final currentYear = DateTime.now().year;
    if (registrationYear <= 0 || registrationYear > currentYear) return 0;
    return currentYear - registrationYear;
  }
}