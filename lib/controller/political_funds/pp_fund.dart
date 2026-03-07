import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'package:excel/excel.dart'; 
import 'package:supabase_flutter/supabase_flutter.dart';

class PoliticalPartyFundService {
  final supabase = Supabase.instance.client;

  Future<List<List<dynamic>>> fetchPoliticalFunds() async {
    try {
      // Note: Ensure the filename matches your Supabase bucket path
      const fileName = 'political_parties_fund_dataset.xlsx'; 

      final Uint8List response = await supabase
          .storage
          .from('political_parties_fund_dataset')
          .download(fileName);

      // Decode the Excel file
      var excel = Excel.decodeBytes(response);
      List<List<dynamic>> rowData = [];

      // Loop through the first sheet
      for (var table in excel.tables.keys) {
        for (var row in excel.tables[table]!.rows) {
          // Convert Excel 'Data' objects to raw values
          rowData.add(row.map((cell) => cell?.value).toList());
        }
      }
      return rowData;
    } catch (e) {
      debugPrint('Error fetching Excel data: $e');
      return [];
    }
  }
}