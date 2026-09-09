export type ReportExportCell = string | number | boolean | null | undefined;

export interface ReportExportSheet {
  name: string;
  rows: ReportExportCell[][];
}

const UTF8_BOM = '\uFEFF';

export function escapeCsvCell(value: ReportExportCell): string {
  if (value === null || value === undefined) {
    return '';
  }

  const text = typeof value === 'boolean' ? (value ? 'TRUE' : 'FALSE') : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function toCsv(sheets: ReportExportSheet[]): string {
  const lines: string[] = [];

  sheets.forEach((sheet, index) => {
    if (sheets.length > 1) {
      lines.push(escapeCsvCell(sheet.name));
    }

    for (const row of sheet.rows) {
      lines.push(row.map(escapeCsvCell).join(','));
    }

    if (index < sheets.length - 1) {
      lines.push('');
    }
  });

  return `${UTF8_BOM}${lines.join('\r\n')}\r\n`;
}

export function sanitizeSheetName(name: string): string {
  const cleaned = name.replace(/[:\\/?*[\]]/g, ' ').replace(/\s+/g, ' ').trim();
  return (cleaned || 'Sheet').slice(0, 31);
}

export function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || 'report';
}

export function ensureExtension(filename: string, extension: string): string {
  const suffix = `.${extension}`;
  const sanitized = sanitizeFilename(filename);
  return sanitized.toLowerCase().endsWith(suffix) ? sanitized : `${sanitized}${suffix}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadCsv(sheets: ReportExportSheet[], filename: string): void {
  const csv = toCsv(sheets);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, ensureExtension(filename, 'csv'));
}

function columnWidths(rows: ReportExportCell[][]): Array<{ wch: number }> {
  const widths: number[] = [];

  for (const row of rows) {
    row.forEach((cell, index) => {
      const length = cell === null || cell === undefined ? 0 : String(cell).length;
      widths[index] = Math.max(widths[index] ?? 8, Math.min(length + 2, 48));
    });
  }

  return widths.map((wch) => ({ wch }));
}

export async function downloadXlsx(sheets: ReportExportSheet[], filename: string): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const aoa = sheet.rows.map((row) => row.map((cell) => cell ?? ''));
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    worksheet['!cols'] = columnWidths(sheet.rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(sheet.name));
  }

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, ensureExtension(filename, 'xlsx'));
}

export function formatReportTime(value: Date | string | undefined | null): string {
  if (!value) {
    return '-';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function arrivalStatus(attendance: Array<{ isLate: boolean }> | undefined): string {
  if (!attendance?.length) {
    return 'Absent';
  }

  return attendance[0].isLate ? 'Late' : 'On time';
}
