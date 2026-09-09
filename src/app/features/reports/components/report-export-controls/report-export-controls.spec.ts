import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as reportExport from '../../utils/report-export';
import { ReportExportControls } from './report-export-controls';

describe('ReportExportControls', () => {
  let fixture: ComponentFixture<ReportExportControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportExportControls],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportExportControls);
    fixture.componentRef.setInput('filename', 'member-status');
    fixture.componentRef.setInput('sheets', [{ name: 'Summary', rows: [['TOTAL', 1]] }]);
    fixture.detectChanges();
  });

  it('disables both actions while loading or empty', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(2);
    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[1].disabled).toBeTrue();
  });

  it('exports Excel and CSV when data is available', async () => {
    const excelSpy = spyOn(reportExport, 'downloadXlsx').and.resolveTo();
    const csvSpy = spyOn(reportExport, 'downloadCsv');

    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const [excelButton, csvButton] = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    excelButton.click();
    await fixture.whenStable();
    csvButton.click();

    expect(excelSpy).toHaveBeenCalled();
    expect(csvSpy).toHaveBeenCalled();
  });
});
