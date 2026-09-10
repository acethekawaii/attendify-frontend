import { AttendanceByHierarchyModel } from '../models/attendance-by-hierarchy.model';
import { DiscipleModel, SummaryModel } from '../models/attendance-by-primary-leader.model';
import { SummaryCategoryModel } from '../models/attendance-summary.model';
import { arrivalStatus, formatReportTime, ReportExportCell, ReportExportSheet } from './report-export';

export interface ReportExportMeta {
  title: string;
  dateLabel: string;
  eventName: string;
}

function metadataRows(meta: ReportExportMeta): ReportExportCell[][] {
  return [[meta.title], ['Date', meta.dateLabel], ['Event', meta.eventName], []];
}

function categoryRows(categories: SummaryCategoryModel[]): ReportExportCell[][] {
  return categories.map((category) => [category.name, category.count ?? 0]);
}

export function buildMemberStatusSheets(
  meta: ReportExportMeta,
  regularAttendees: SummaryCategoryModel[],
  totalRegulars: number,
  vipAttendees: SummaryCategoryModel[],
  totalVips: number,
  grandTotal: number,
): ReportExportSheet[] {
  return [
    {
      name: 'Summary',
      rows: [
        ...metadataRows(meta),
        ['Member Status', 'Attendees'],
        ['Attendees'],
        ...categoryRows(regularAttendees),
        ['TOTAL', totalRegulars],
        ['VIPs'],
        ...categoryRows(vipAttendees),
        ['TOTAL', totalVips],
        ['GRAND TOTAL', grandTotal],
      ],
    },
  ];
}

export function buildChurchProcessSheets(
  meta: ReportExportMeta,
  regularAttendees: SummaryCategoryModel[],
  grandTotal: number,
): ReportExportSheet[] {
  return [
    {
      name: 'Summary',
      rows: [
        ...metadataRows(meta),
        ['Church Process', 'Attendees'],
        ['Attendees'],
        ...categoryRows(regularAttendees),
        ['GRAND TOTAL', grandTotal],
      ],
    },
  ];
}

export function buildLeadersSheets(
  meta: ReportExportMeta,
  leaders: AttendanceByHierarchyModel[],
): ReportExportSheet[] {
  return [
    {
      name: 'Primary Leaders',
      rows: [
        ...metadataRows(meta),
        ['Name', 'Time Arrival', 'Status'],
        ['Primary Leader'],
        ...leaders.map((leader) => [
          `${leader.firstName} ${leader.lastName}`.trim(),
          leader.attendance.length > 0 ? formatReportTime(leader.attendance[0].timeIn) : '-',
          arrivalStatus(leader.attendance),
        ]),
      ],
    },
  ];
}

export function buildCellMemberSheets(
  meta: ReportExportMeta,
  primaryLeaderName: string,
  summary: SummaryModel | null,
  disciples: DiscipleModel[],
): ReportExportSheet[] {
  const summaryRows: ReportExportCell[][] = [
    ...metadataRows(meta),
    ['Member Status', 'Attendees'],
    ['Attendees'],
    ...categoryRows(summary?.attendees.categories ?? []),
    ['TOTAL', summary?.attendees.total ?? 0],
    ['VIPs'],
    ...categoryRows(summary?.vips.categories ?? []),
    ['TOTAL', summary?.vips.total ?? 0],
  ];

  const memberRows: ReportExportCell[][] = [
    ...metadataRows(meta),
    ['Name', 'Member Status', 'Process', 'Time Arrival', 'Status'],
    [primaryLeaderName],
    ...disciples.map((disciple) => [
      `${disciple.firstName} ${disciple.lastName}`.trim(),
      disciple.memberStatus ?? '',
      disciple.churchProcess ?? '',
      disciple.attendance.length > 0 ? formatReportTime(disciple.attendance[0].timeIn) : '-',
      arrivalStatus(disciple.attendance),
    ]),
  ];

  return [
    { name: 'Summary', rows: summaryRows },
    { name: 'Cell Members', rows: memberRows },
  ];
}
