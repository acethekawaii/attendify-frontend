import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

import { ReportsService } from '@/app/features/reports/services/reports';
import { DEFAULT_DATE_FORMAT } from '@/app/shared/utils/date-format';
import { ReportSkeleton } from "@/app/shared/components/report-skeleton/report-skeleton";
import { DiscipleModel, SummaryModel } from '@/app/features/reports/models/attendance-by-primary-leader.model';
import { ErrorCard } from "@/app/shared/components/error-card/error-card";
import { LucideAngularModule, Users } from 'lucide-angular';
import { Event, EVENTS } from '@/app/core/constants/events';
import { ReportExportControls } from '@/app/features/reports/components/report-export-controls/report-export-controls';
import { buildCellMemberSheets } from '@/app/features/reports/utils/report-export-tables';
import { ReportExportSheet } from '@/app/features/reports/utils/report-export';

@Component({
  selector: 'app-cell-member-attendance-summary',
  imports: [
    NgClass,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReportSkeleton,
    LucideAngularModule,
    ErrorCard,
    ReportExportControls
],
  providers: [provideMomentDateAdapter(DEFAULT_DATE_FORMAT)],
  templateUrl: './cell-member-attendance-summary.html',
  styleUrl: './cell-member-attendance-summary.css'
})
export class CellMemberAttendanceSummary {
  readonly Users = Users;

  private route = inject(ActivatedRoute);
  private reportService = inject(ReportsService);
  private destroy$ = new Subject<void>();

  readonly date = new FormControl(moment(), { nonNullable: true });
  selectedEvent: string = "8757623d-1714-409c-a05d-f3896d44b5cf";

  events: Event[] = EVENTS;
  primaryLeaderId = this.route.snapshot.paramMap.get('primaryLeaderId');
  primaryLeader: {firstName: string, lastName: string } | null = null;
  summary: SummaryModel | null = null;
  disciples: DiscipleModel[] = [];
  isDisciplesDataLoading = false;
  isDisciplesDataEmpty = false;
  
  ngOnInit(): void {
    const lastSunday = moment().day(0);
    this.date.setValue(lastSunday);

    this.date.valueChanges.subscribe(() => {
      this.loadAttendanceByPrimaryLeader();
    })

    this.loadAttendanceByPrimaryLeader();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get primaryLeaderFullName(): string {
    if (this.primaryLeader) {
      return `${this.primaryLeader.firstName} ${this.primaryLeader.lastName}`;
    }
    return '';
  }

  loadAttendanceByPrimaryLeader() {
    if (!this.primaryLeaderId) return;
    this.isDisciplesDataLoading = true;
    this.isDisciplesDataEmpty = false;
    const formattedDate = this.date.value.format('YYYY-MM-DD');

    this.reportService.getAttendanceByPrimaryLeader(this.selectedEvent, formattedDate, this.primaryLeaderId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.primaryLeader = response.data.primaryLeader;
        this.disciples = response.data.disciples;
        this.summary = response.data.summary;
        this.isDisciplesDataLoading = false;
        this.isDisciplesDataEmpty = this.disciples.length === 0;
        console.log(this.summary)
      },
      error: (error) => {
        console.error('Error loading attendance by primary leader:', error);
      }
    })
  }

  onSelectionChange(event: any) {
    this.loadAttendanceByPrimaryLeader();
  }

  get selectedEventName(): string {
    return this.events.find((event) => event.id === this.selectedEvent)?.name ?? 'Unknown event';
  }

  get exportFilename(): string {
    const leaderSlug = this.primaryLeaderFullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = leaderSlug ? `_${leaderSlug}` : '';
    return `cell-member-attendance-summary${suffix}_${this.date.value.format('YYYY-MM-DD')}`;
  }

  get exportSheets(): ReportExportSheet[] {
    return buildCellMemberSheets(
      {
        title: 'LTHMI Recto Manila - Cell Member Attendance Summary',
        dateLabel: this.date.value.format('MMMM D, YYYY'),
        eventName: this.selectedEventName,
      },
      this.primaryLeaderFullName,
      this.summary,
      this.disciples,
    );
  }

  get isExportDisabled(): boolean {
    return this.isDisciplesDataLoading || this.isDisciplesDataEmpty;
  }
}
