import 'package:excel/excel.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:trans_portal/model/party_profile/party_profile.dart';

class ExcelPoliticalService {
  final String registryUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/fully_registered_political_parties/fully_registered_political_parties.xlsx";

  final String fundingUrl =
      "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/political_parties_fund_dataset/political_parties_fund_dataset.xlsx";

  Future<List<PartyProfile>> getMergedData() async {
    try {
      final regRes = await http.get(Uri.parse(registryUrl));
      final fundRes = await http.get(Uri.parse(fundingUrl));

      if (regRes.statusCode != 200 || fundRes.statusCode != 200) {
        debugPrint(
          'Failed to fetch files. Registry: ${regRes.statusCode}, Funding: ${fundRes.statusCode}',
        );
        return [];
      }

      final regExcel = Excel.decodeBytes(regRes.bodyBytes);
      final fundExcel = Excel.decodeBytes(fundRes.bodyBytes);

      final registrySheet =
          regExcel.tables["Registered Political Parties"] ??
          regExcel.tables[regExcel.tables.keys.first];

      final fundingSheet = fundExcel.tables[fundExcel.tables.keys.first];

      if (registrySheet == null || fundingSheet == null) {
        debugPrint('Could not locate one or more sheets.');
        return [];
      }

      final fundingMap = _buildFundingMap(fundingSheet);
      final profiles = _buildProfiles(registrySheet, fundingMap);

      profiles.sort((a, b) => b.totalFunding.compareTo(a.totalFunding));
      return profiles;
    } catch (e, st) {
      debugPrint("Excel Fetch Error: $e");
      debugPrintStack(stackTrace: st);
      return [];
    }
  }

  Map<String, double> _buildFundingMap(Sheet sheet) {
    final fundingMap = <String, double>{};

    for (int i = 1; i < sheet.maxRows; i++) {
      final row = sheet.rows[i];
      if (row.length < 3) continue;

      final rawParty = row[1]?.value?.toString() ?? '';
      final normalizedParty = _normalizePartyName(rawParty);
      if (normalizedParty.isEmpty) continue;

      final amount = _parseAmount(row[2]?.value?.toString() ?? '0');
      fundingMap[normalizedParty] =
          (fundingMap[normalizedParty] ?? 0.0) + amount;
    }

    return fundingMap;
  }

  List<PartyProfile> _buildProfiles(
    Sheet sheet,
    Map<String, double> fundingMap,
  ) {
    final profiles = <PartyProfile>[];

    for (int i = 2; i < sheet.maxRows; i++) {
      final row = sheet.rows[i];
      if (row.length < 10) continue;

      final rawName = _cleanText(row[2]?.value?.toString() ?? '');
      if (rawName.isEmpty) continue;

      final normalizedName = _normalizePartyName(rawName);
      final registrationYear = _parseYear(row[4]?.value?.toString() ?? '');
      final location = _cleanText(row[8]?.value?.toString() ?? '');
      final slogan = _cleanText(row[9]?.value?.toString() ?? '');

      int filled = 0;
      if (_cleanText(row[5]?.value?.toString() ?? '').isNotEmpty) filled++;
      if (_cleanText(row[6]?.value?.toString() ?? '').isNotEmpty) filled++;
      if (slogan.isNotEmpty) filled++;

      final completenessScore = (filled / 3) * 100;

      profiles.add(
        PartyProfile(
          name: rawName,
          registrationYear: registrationYear,
          totalFunding: fundingMap[normalizedName] ?? 0.0,
          completenessScore: completenessScore,
          location: location.isEmpty ? 'Unknown' : location,
          slogan: slogan.isEmpty ? 'N/A' : slogan,
        ),
      );
    }

    return profiles;
  }

  String _cleanText(String value) {
    return value.replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  String _normalizePartyName(String value) {
    return _cleanText(value)
        .toLowerCase()
        .replaceAll('&', 'and')
        .replaceAll(RegExp(r'[^a-z0-9 ]'), '')
        .replaceAll(RegExp(r'\bparty\b'), '')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
  }

  double _parseAmount(String raw) {
    final cleaned = raw.replaceAll(RegExp(r'[^0-9.]'), '');
    return double.tryParse(cleaned) ?? 0.0;
  }

  int _parseYear(String raw) {
    final match = RegExp(r'(19|20)\d{2}').firstMatch(raw);
    return match != null ? int.tryParse(match.group(0)!) ?? 0 : 0;
  }
}