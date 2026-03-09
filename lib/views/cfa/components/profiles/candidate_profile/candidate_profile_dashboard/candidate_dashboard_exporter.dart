import 'dart:typed_data';

import 'package:excel/excel.dart';
import 'package:file_saver/file_saver.dart';
import 'package:trans_portal/controller/candidate_data_service/candidate_data_service.dart';

class CandidateDashboardExporter {
  static Future<void> export({
    required CandidateDashboardData data,
    required String yearLabel,
    required String partyQuery,
    required List<PartyROI> visibleRoi,
    required List<CandidateRecord> visibleCandidates,
    required Map<String, int> visibleCountyDensity,
    required Map<String, int> visibleAffiliationStats,
    required Map<String, int> visiblePositionFocus,
  }) async {
    final excel = Excel.createExcel();

    final summary = excel['Summary'];
    summary.appendRow([
      TextCellValue('Candidate Insights Export'),
    ]);
    summary.appendRow([
      TextCellValue('Year Filter'),
      TextCellValue(yearLabel),
    ]);
    summary.appendRow([
      TextCellValue('Party Search'),
      TextCellValue(partyQuery.isEmpty ? 'None' : partyQuery),
    ]);
    summary.appendRow([
      TextCellValue('Visible Parties'),
      IntCellValue(visibleRoi.length),
    ]);
    summary.appendRow([
      TextCellValue('Visible Candidates'),
      IntCellValue(visibleCandidates.length),
    ]);
    summary.appendRow([]);

    summary.appendRow([
      TextCellValue('Affiliation Type'),
      TextCellValue('Count'),
    ]);

    visibleAffiliationStats.forEach((key, value) {
      summary.appendRow([
        TextCellValue(key),
        IntCellValue(value),
      ]);
    });

    final roiSheet = excel['Party ROI'];
    roiSheet.appendRow([
      TextCellValue('Party'),
      TextCellValue('Funding'),
      TextCellValue('Candidates'),
      TextCellValue('Cost Per Candidate'),
    ]);

    for (final roi in visibleRoi) {
      roiSheet.appendRow([
        TextCellValue(roi.name),
        DoubleCellValue(roi.funding),
        IntCellValue(roi.candidates),
        DoubleCellValue(roi.costPerCandidate),
      ]);
    }

    final countySheet = excel['County Density'];
    countySheet.appendRow([
      TextCellValue('County'),
      TextCellValue('Candidate Count'),
    ]);

    final sortedCountyEntries = visibleCountyDensity.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    for (final entry in sortedCountyEntries) {
      countySheet.appendRow([
        TextCellValue(entry.key),
        IntCellValue(entry.value),
      ]);
    }

    final positionSheet = excel['Position Focus'];
    positionSheet.appendRow([
      TextCellValue('Position'),
      TextCellValue('Count'),
    ]);

    final sortedPositionEntries = visiblePositionFocus.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    for (final entry in sortedPositionEntries) {
      positionSheet.appendRow([
        TextCellValue(entry.key),
        IntCellValue(entry.value),
      ]);
    }

    final candidatesSheet = excel['Candidates'];
    candidatesSheet.appendRow([
      TextCellValue('County'),
      TextCellValue('Party'),
      TextCellValue('Position'),
    ]);

    for (final c in visibleCandidates) {
      candidatesSheet.appendRow([
        TextCellValue(c.county),
        TextCellValue(c.party),
        TextCellValue(c.position),
      ]);
    }

    final bytes = excel.encode();
    if (bytes == null) {
      throw Exception('Failed to generate export file.');
    }

    await FileSaver.instance.saveFile(
      name: 'candidate_insights_export',
      bytes: Uint8List.fromList(bytes),
      ext: 'xlsx',
      mimeType: MimeType.microsoftExcel,
    );
  }
}