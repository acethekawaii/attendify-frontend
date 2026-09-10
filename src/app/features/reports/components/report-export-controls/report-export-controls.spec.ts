import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    expect(buttons[0].textContent).toContain('Export Excel');
    expect(buttons[1].textContent).toContain('Export CSV');
  });

  it('enables both actions after data loads', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBeFalse();
    expect(buttons[1].disabled).toBeFalse();
  });
});
