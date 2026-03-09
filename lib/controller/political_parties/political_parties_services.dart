import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:excel/excel.dart';
import 'package:trans_portal/model/party_profile/party_profile.dart';

class ExcelPoliticalService {
  final String registryUrl = "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/fully_registered_political_parties/fully_registered_political_parties.xlsx";
  final String fundingUrl = "https://uaxdyysgnpxgcivukpig.supabase.co/storage/v1/object/public/political_parties_fund_dataset/political_parties_fund_dataset.xlsx";

  Future<List<PartyProfile>> getMergedData() async {
    try {
      final regRes = await http.get(Uri.parse(registryUrl));
      final fundRes = await http.get(Uri.parse(fundingUrl));

      if (regRes.statusCode != 200 || fundRes.statusCode != 200) return [];

      var regExcel = Excel.decodeBytes(regRes.bodyBytes);
      var fundExcel = Excel.decodeBytes(fundRes.bodyBytes);

      // Your merging logic as defined in the previous step...
      // Ensure PartyProfile class is also defined here or imported.
      return []; // Replace with actual processing logic
    } catch (e) {
      debugPrint("Excel Fetch Error: $e");
      return [];
    }
  }
}