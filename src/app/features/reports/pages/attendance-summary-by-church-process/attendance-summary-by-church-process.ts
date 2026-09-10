import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';

import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Users, LucideAngularModule } from 'lucide-angular';

import { SummaryCategoryModel } from '@/app/features/reports/models/attendance-summary.model';
import { ReportSkeleton } from "@/app/shared/components/report-skeleton/report-skeleton";
import { ReportsService } from '@/app/features/reports/services/reports';
import { DEFAULT_DATE_FORMAT } from '@/app/shared/utils/date-format';
import { ErrorCard } from "@/app/shared/components/error-card/error-card";
import { Event, EVENTS } from '@/app/core/constants/events';
import { ReportExportControls } from '@/app/features/reports/components/report-export-controls/report-export-controls';
import { buildChurchProcessSheets } from '@/app/features/reports/utils/report-export-tables';
import { ReportExportSheet } from '@/app/features/reports/utils/report-export';

@Component({
  selector: 'app-attendance-summary-by-church-process',
  imports: [
    LucideAngularModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    DatePipe,
    ErrorCard,
    ReportSkeleton,
    ReportExportControls,
  ],
  providers: [provideMomentDateAdapter(DEFAULT_DATE_FORMAT)],
  templateUrl: './attendance-summary-by-church-process.html',
  styleUrl: './attendance-summary-by-church-process.css'
})
export class AttendanceSummaryByChurchProcess {
  readonly Users = Users;

  private reportService = inject(ReportsService);

  readonly date = new FormControl(moment(), { nonNullable: true });
  selectedEvent: string = "8757623d-1714-409c-a05d-f3896d44b5cf";

  events: Event[] = EVENTS;

  isAttendanceSummaryLoading = false;
  isAttendanceSummaryEmpty = false;
  regularAttendees: SummaryCategoryModel[] = [];
  vipAttendees: SummaryCategoryModel[] = [];
  totalVips: number = 0;
  grandTotal: number = 0;

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    const lastSunday = moment().day(0);
    this.date.setValue(lastSunday);

    this.date.valueChanges.subscribe(() => {
      this.loadAttendanceSummary();
    })
    
    this.loadAttendanceSummary();
  }

  loadAttendanceSummary() {
    this.isAttendanceSummaryLoading = true;
    this.isAttendanceSummaryEmpty = false;
    const formattedDate = this.date.value.format('YYYY-MM-DD');

    this.reportService.getAttendanceSummary(this.selectedEvent, formattedDate, 'churchProcess').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.isAttendanceSummaryLoading = false;
        this.isAttendanceSummaryEmpty = response.data.summary.totalAttendees === 0;
        const { attendees, vips } = response.data.summary;

        this.regularAttendees = attendees.categories;
        this.vipAttendees = vips.categories;
        this.totalVips = vips.total;
        this.grandTotal = response.data.summary.totalAttendees;
      },
      error: (error) => {
        this.isAttendanceSummaryLoading = false;
        console.error('Error loading initial data:', error);
      }
    })
  }

  onSelectionChange(event: any) {
    this.loadAttendanceSummary();
  }

  get selectedEventName(): string {
    return this.events.find((event) => event.id === this.selectedEvent)?.name ?? 'Unknown event';
  }

  get exportFilename(): string {
    return `attendance-summary-pepsol-students_${this.date.value.format('YYYY-MM-DD')}`;
  }

  get exportSheets(): ReportExportSheet[] {
    return buildChurchProcessSheets(
      {
        title: 'LTHMI Recto Manila - Attendance Summary of Pepsol Students',
        dateLabel: this.date.value.format('MMMM D, YYYY'),
        eventName: this.selectedEventName,
      },
      this.regularAttendees,
      this.grandTotal,
    );
  }

  get isExportDisabled(): boolean {
    return this.isAttendanceSummaryLoading || this.isAttendanceSummaryEmpty;
  }
}
