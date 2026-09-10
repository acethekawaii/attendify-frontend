import { ChurchProcessEnum } from '@/app/core/enums/church-process.enum';
import { MemberStatusEnum } from '@/app/core/enums/member-status.enum';

import {
  buildCellMemberSheets,
  buildChurchProcessSheets,
  buildLeadersSheets,
  buildMemberStatusSheets,
} from './report-export-tables';

const meta = {
  title: 'LTHMI Recto Manila - Test Report',
  dateLabel: 'September 6, 2026',
  eventName: 'LTHMI - Recto Sunday Service',
};

describe('report-export-tables', () => {
  it('builds the member-status table with section totals', () => {
    const [sheet] = buildMemberStatusSheets(
      meta,
      [{ name: 'Regular', count: 10 }],
      10,
      [{ name: 'First Timer', count: 2 }],
      2,
      12,
    );

    expect(sheet.name).toBe('Summary');
    expect(sheet.rows).toContain(['Member Status', 'Attendees']);
    expect(sheet.rows).toContain(['Regular', 10]);
    expect(sheet.rows).toContain(['First Timer', 2]);
    expect(sheet.rows).toContain(['GRAND TOTAL', 12]);
  });

  it('builds the pepsol / church-process table without a VIP section', () => {
    const [sheet] = buildChurchProcessSheets(meta, [{ name: 'SOL 1', count: 7 }], 7);

    expect(sheet.rows).toContain(['Church Process', 'Attendees']);
    expect(sheet.rows).toContain(['SOL 1', 7]);
    expect(sheet.rows).toContain(['GRAND TOTAL', 7]);
    expect(sheet.rows.some((row) => row[0] === 'VIPs')).toBeFalse();
  });

  it('builds the primary-leader table with arrival status', () => {
    const [sheet] = buildLeadersSheets(meta, [
      {
        id: '1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        attendance: [{ timeIn: new Date('2026-09-06T01:05:00.000Z'), isLate: false }],
      },
      {
        id: '2',
        firstName: 'Grace',
        lastName: 'Hopper',
        attendance: [],
      },
    ]);

    expect(sheet.rows[4]).toEqual(['Name', 'Time Arrival', 'Status']);
    expect(sheet.rows[6][0]).toBe('Ada Lovelace');
    expect(sheet.rows[6][2]).toBe('On time');
    expect(sheet.rows[7]).toEqual(['Grace Hopper', '-', 'Absent']);
  });

  it('builds cell-member summary and roster sheets', () => {
    const sheets = buildCellMemberSheets(
      meta,
      'Ada Lovelace',
      {
        attendees: { total: 1, categories: [{ name: 'Regular', count: 1 }] },
        vips: { total: 0, categories: [] },
        totalDisciples: 1,
        present: 1,
        absent: 0,
      },
      [
        {
          firstName: 'Alan',
          lastName: 'Turing',
          memberStatus: MemberStatusEnum.REGULAR_DISCIPLE,
          churchProcess: ChurchProcessEnum.SOL_1,
          attendance: [{ timeIn: new Date('2026-09-06T01:15:00.000Z'), isLate: true }],
        },
      ],
    );

    expect(sheets.map((sheet) => sheet.name)).toEqual(['Summary', 'Cell Members']);
    expect(sheets[0].rows).toContain(['Regular', 1]);
    expect(sheets[1].rows[5][0]).toBe('Ada Lovelace');
    expect(sheets[1].rows[6][0]).toBe('Alan Turing');
    expect(sheets[1].rows[6][1]).toBe(MemberStatusEnum.REGULAR_DISCIPLE);
    expect(sheets[1].rows[6][4]).toBe('Late');
  });
});
