import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FileDown, FileSpreadsheet, LucideAngularModule } from 'lucide-angular';

import { downloadCsv, downloadXlsx, ReportExportSheet } from '../../utils/report-export';

@Component({
  selector: 'app-report-export-controls',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'print:hidden inline-flex flex-wrap items-center gap-2',
  },
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-white bg-primary-action transition-colors hover:bg-primary-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monochromatic-dark disabled:bg-line-strong disabled:text-text-300 disabled:cursor-not-allowed"
      [disabled]="isBusy()"
      [attr.aria-disabled]="isBusy()"
      (click)="exportExcel()"
    >
      <lucide-angular class="w-4 h-4" [img]="FileSpreadsheet"></lucide-angular>
      <span>Export Excel</span>
    </button>

    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium bg-surface text-primary-action border border-line transition-colors hover:bg-monochromatic-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monochromatic-dark disabled:bg-line-strong disabled:text-text-300 disabled:border-line-strong disabled:cursor-not-allowed"
      [disabled]="isBusy()"
      [attr.aria-disabled]="isBusy()"
      (click)="exportCsv()"
    >
      <lucide-angular class="w-4 h-4" [img]="FileDown"></lucide-angular>
      <span>Export CSV</span>
    </button>
  `,
})
export class ReportExportControls {
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly FileDown = FileDown;

  readonly disabled = input(false);
  readonly filename = input.required<string>();
  readonly sheets = input.required<ReportExportSheet[]>();

  private readonly exporting = signal(false);
  readonly isBusy = computed(() => this.disabled() || this.exporting());

  async exportExcel(): Promise<void> {
    if (this.isBusy()) {
      return;
    }

    this.exporting.set(true);
    try {
      await downloadXlsx(this.sheets(), this.filename());
    } catch (error) {
      console.error('Unable to export Excel report:', error);
    } finally {
      this.exporting.set(false);
    }
  }

  exportCsv(): void {
    if (this.isBusy()) {
      return;
    }

    try {
      downloadCsv(this.sheets(), this.filename());
    } catch (error) {
      console.error('Unable to export CSV report:', error);
    }
  }
}
