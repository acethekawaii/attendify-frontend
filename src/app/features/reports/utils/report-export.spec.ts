import {
  arrivalStatus,
  downloadCsv,
  downloadXlsx,
  ensureExtension,
  escapeCsvCell,
  formatReportTime,
  sanitizeFilename,
  sanitizeSheetName,
  toCsv,
} from './report-export';

describe('report-export', () => {
  describe('escapeCsvCell', () => {
    it('returns an empty string for nullish values', () => {
      expect(escapeCsvCell(null)).toBe('');
      expect(escapeCsvCell(undefined)).toBe('');
    });

    it('stringifies booleans as TRUE/FALSE for Sheets', () => {
      expect(escapeCsvCell(true)).toBe('TRUE');
      expect(escapeCsvCell(false)).toBe('FALSE');
    });

    it('quotes commas, quotes, and line breaks', () => {
      expect(escapeCsvCell('Last, First')).toBe('"Last, First"');
      expect(escapeCsvCell('He said "ok"')).toBe('"He said ""ok"""');
      expect(escapeCsvCell('line\nbreak')).toBe('"line\nbreak"');
    });

    it('leaves plain numbers and text unquoted', () => {
      expect(escapeCsvCell(42)).toBe('42');
      expect(escapeCsvCell('Regular')).toBe('Regular');
    });
  });

  describe('toCsv', () => {
    it('writes a UTF-8 BOM and CRLF rows for Excel/Sheets', () => {
      const csv = toCsv([
        {
          name: 'Summary',
          rows: [
            ['Member Status', 'Attendees'],
            ['Regular', 12],
          ],
        },
      ]);

      expect(csv.startsWith('\uFEFF')).toBeTrue();
      expect(csv).toContain('Member Status,Attendees\r\nRegular,12\r\n');
    });

    it('prefixes each section when exporting multiple sheets', () => {
      const csv = toCsv([
        { name: 'Summary', rows: [['TOTAL', 4]] },
        { name: 'Cell Members', rows: [['Ada Lovelace', 'On time']] },
      ]);

      expect(csv).toContain('Summary\r\nTOTAL,4\r\n\r\nCell Members\r\nAda Lovelace,On time\r\n');
    });
  });

  describe('sanitize helpers', () => {
    it('strips illegal Excel sheet characters and caps length', () => {
      expect(sanitizeSheetName('Primary: Leaders / Roster?*')).toBe('Primary Leaders Roster');
      expect(sanitizeSheetName('x'.repeat(40)).length).toBe(31);
      expect(sanitizeSheetName(':::')).toBe('Sheet');
    });

    it('builds a safe download filename with the right extension', () => {
      expect(sanitizeFilename('LTHMI / Recto: Sunday')).toBe('LTHMI-Recto-Sunday');
      expect(ensureExtension('report', 'xlsx')).toBe('report.xlsx');
      expect(ensureExtension('report.xlsx', 'xlsx')).toBe('report.xlsx');
    });
  });

  describe('arrival helpers', () => {
    it('formats a valid time and falls back to a dash', () => {
      expect(formatReportTime(new Date('2026-09-06T01:05:00.000Z'))).toMatch(/\d{1,2}:\d{2}/);
      expect(formatReportTime(undefined)).toBe('-');
      expect(formatReportTime('not-a-date')).toBe('-');
    });

    it('maps attendance to On time, Late, or Absent', () => {
      expect(arrivalStatus([{ isLate: false }])).toBe('On time');
      expect(arrivalStatus([{ isLate: true }])).toBe('Late');
      expect(arrivalStatus([])).toBe('Absent');
      expect(arrivalStatus(undefined)).toBe('Absent');
    });
  });

  describe('downloads', () => {
    let clickSpy: jasmine.Spy;
    let createObjectUrlSpy: jasmine.Spy;
    let revokeObjectUrlSpy: jasmine.Spy;

    beforeEach(() => {
      clickSpy = spyOn(HTMLAnchorElement.prototype, 'click');
      createObjectUrlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:report');
      revokeObjectUrlSpy = spyOn(URL, 'revokeObjectURL');
    });

    it('downloads a Sheets-friendly CSV', () => {
      downloadCsv([{ name: 'Summary', rows: [['TOTAL', 3]] }], 'member-status');

      const blob = createObjectUrlSpy.calls.mostRecent().args[0] as Blob;
      expect(blob.type).toContain('text/csv');
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:report');
    });

    it('lazy-loads SheetJS and downloads a valid xlsx workbook', async () => {
      await downloadXlsx(
        [
          {
            name: 'Summary',
            rows: [
              ['Member Status', 'Attendees'],
              ['Regular', 4],
            ],
          },
        ],
        'member-status',
      );

      const blob = createObjectUrlSpy.calls.mostRecent().args[0] as Blob;
      expect(blob.type).toContain('spreadsheetml.sheet');
      expect(clickSpy).toHaveBeenCalled();

      const buffer = await blob.arrayBuffer();
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(buffer, { type: 'array' });
      expect(workbook.SheetNames).toEqual(['Summary']);
      expect(XLSX.utils.sheet_to_json(workbook.Sheets['Summary'], { header: 1 })).toEqual([
        ['Member Status', 'Attendees'],
        ['Regular', 4],
      ]);
    });
  });
});
