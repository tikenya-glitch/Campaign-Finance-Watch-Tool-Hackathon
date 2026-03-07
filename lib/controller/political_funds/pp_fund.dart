import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:csv/csv.dart';

class PoliticalPartyFundService {
  final supabase = Supabase.instance.client;

  Future<List<List<dynamic>>> fetchPoliticalFunds() async {
    try {
      // Use the EXACT filename as it appears in your Supabase Bucket
      // From your upload: 'political_parties_fund_dataset.csv'
      const fileName = 'political_parties_fund_dataset.csv'; // <-- Make sure this matches your actual file name in Supabase

      // 1. Download the file as bytes
      // Note: We use the filename, NOT the https:// URL
      final response = await supabase
          .storage
          .from('political_parties_fund_dataset')
          .download(fileName);

      // 2. Convert bytes to string (UTF-8)
      String csvString = String.fromCharCodes(response);

      // 3. Parse CSV (The 'const' or 'new' keyword is required for the converter)
      List<List<dynamic>> rows = (const CsvToListConverter().convert(csvString) as List<dynamic>).cast<List<dynamic>>();
      
      return rows; 
    } catch (e) {
      print('Error fetching data: $e');
      return [];
    }
  }
}

class CsvToListConverter {
  const CsvToListConverter();
  
  List<dynamic> convert(String csvString) {
    throw UnimplementedError();
  }
}