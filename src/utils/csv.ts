import type { Participant } from '../types/participant';
import { isValidPhone } from './phone';

export interface CsvParseResult {
  valid: Participant[];
  errors: CsvRowError[];
}

export interface CsvRowError {
  row: number;
  field: string;
  message: string;
  raw: string;
}

const SUPPORTED_HEADERS = ['id', 'firstName', 'lastName', 'year', 'phone'] as const;
type CsvHeader = (typeof SUPPORTED_HEADERS)[number];

/** Parses a raw CSV string into Participant records, reporting row-level errors. */
export function parseCsv(raw: string): CsvParseResult {
  const lines = raw.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) {
    return { valid: [], errors: [{ row: 0, field: 'header', message: 'CSV must have a header row and at least one data row.', raw }] };
  }

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, '')) as string[];

  const missingHeaders = SUPPORTED_HEADERS.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      valid: [],
      errors: [{ row: 0, field: 'header', message: `Missing required columns: ${missingHeaders.join(', ')}`, raw: headerLine }],
    };
  }

  const valid: Participant[] = [];
  const errors: CsvRowError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });

    const rowErrors: CsvRowError[] = [];

    for (const field of (['firstName', 'lastName', 'year'] as CsvHeader[])) {
      if (!row[field]) {
        rowErrors.push({ row: i + 1, field, message: `${field} is required.`, raw: lines[i] });
      }
    }

    if (!row['phone']) {
      rowErrors.push({ row: i + 1, field: 'phone', message: 'Phone number is missing.', raw: lines[i] });
    } else if (!isValidPhone(row['phone'])) {
      rowErrors.push({ row: i + 1, field: 'phone', message: `Invalid phone number: "${row['phone']}".`, raw: lines[i] });
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    valid.push({
      id: row['id'] || `csv-${i}`,
      firstName: row['firstName'],
      lastName: row['lastName'],
      year: row['year'],
      phone: row['phone'],
      incomplete: false,
    });
  }

  return { valid, errors };
}

/** Exports a participant list as a CSV string. */
export function exportCsv(participants: Participant[]): string {
  const header = 'id,firstName,lastName,year,phone,incomplete\n';
  const rows = participants
    .map(p => [p.id, p.firstName, p.lastName, p.year, p.phone, p.incomplete ? 'true' : 'false'].map(v => `"${v}"`).join(','))
    .join('\n');
  return header + rows;
}

/** Triggers a browser download of the given CSV string. */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
