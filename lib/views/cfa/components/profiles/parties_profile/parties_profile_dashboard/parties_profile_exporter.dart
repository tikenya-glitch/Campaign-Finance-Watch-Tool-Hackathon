import 'dart:typed_data';

import 'package:excel/excel.dart';
import 'package:file_saver/file_saver.dart';
import 'package:trans_portal/model/party_profile/party_profile.dart';

class PartiesProfileExporter {
  static Future<void> export({
    required List<PartyProfile> profiles,
    required String searchQuery,
  }) async {
    final excel = Excel.createExcel();

    final summary = excel['Summary'];
    summary.appendRow([
      TextCellValue('Political Parties Insights Export'),
    ]);
    summary.appendRow([
      TextCellValue('Search Query'),
      TextCellValue(searchQuery.isEmpty ? 'None' : searchQuery),
    ]);
    summary.appendRow([
      TextCellValue('Visible Parties'),
      IntCellValue(profiles.length),
    ]);
    summary.appendRow([]);

    final sheet = excel['Party Profiles'];
    sheet.appendRow([
      TextCellValue('Party Name'),
      TextCellValue('Registration Year'),
      TextCellValue('Party Age'),
      TextCellValue('Headquarters / Location'),
      TextCellValue('Total Funding'),
      TextCellValue('Completeness Score'),
    ]);

    for (final p in profiles) {
      sheet.appendRow([
        TextCellValue(p.name),
        IntCellValue(p.registrationYear),
        IntCellValue(p.age),
        TextCellValue(p.location),
        DoubleCellValue(p.totalFunding),
        DoubleCellValue(p.completenessScore),
      ]);
    }

    final bytes = excel.encode();
    if (bytes == null) {
      throw Exception('Failed to generate export file.');
    }

    await FileSaver.instance.saveFile(
      name: 'political_parties_insights_export',
      bytes: Uint8List.fromList(bytes),
      ext: 'xlsx',
      mimeType: MimeType.microsoftExcel,
    );
  }
}