import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, Subject, takeUntil } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import { environment } from '@/environments/environment';
import { DashboardService } from '@/app/features/dashboard/services/dashboard';
import { getLastTwoMonthDate } from '@/app/shared/utils/date';
import { LeadersAttendeesTrends } from '@/app/core/mocks/leaders-attendees-trends';
import { LucideAngularModule, TrendingUp, Users } from 'lucide-angular';
import { ServiceComparison } from '@/app/core/mocks/service-comparison';
import { DashboardChart } from '@/app/features/dashboard/charts/dashboard-chart';
import { NamedSeries, NamedValue } from '@/app/features/dashboard/charts/named-series';
import { ApexChartView, toAreaChartView, toGroupedBarView, toLineChartView } from '@/app/features/dashboard/charts/to-apex';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    DashboardChart,
  ],
  providers: [provideMomentDateAdapter()],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly Users = Users;
  readonly TrendingUp = TrendingUp;

  private dashboardService = inject(DashboardService);

  private destroy$ = new Subject<void>();

  readonly organizationId = environment.organizationId;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(getLastTwoMonthDate()),
    end: new FormControl<Date | null>(new Date()),
  });

  overview: NamedValue[] = [];
  attendanceTrendView: ApexChartView = toAreaChartView([]);
  readonly serviceComparisonView = toGroupedBarView(ServiceComparison);
  readonly leadersTrendView = toLineChartView(LeadersAttendeesTrends);

  ngOnInit(): void {
    const start = this.range.value.start!;
    const end = this.range.value.end!;

    this.range.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((val) => {
      if (val.start && val.end) {
        this.getAttendanceTrendsByTimeframe(val.start, val.end);
      }
    });

    this.getAttendanceTrendsByTimeframe(start, end);
    this.getAttendeesOverview();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAttendanceTrendsByTimeframe(from: Date, to: Date): void {
    this.dashboardService.getTrendsByTimeframe(
      from,
      to,
      this.organizationId,
      '8757623d-1714-409c-a05d-f3896d44b5cf',
    ).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (response) => {
        this.attendanceTrendView = toAreaChartView(asNamedSeries(response.data), {
          start: from,
          end: to,
        });
      },
      error: (error) => {
        console.error('Error loading attendance trends:', error);
      },
    });
  }

  getAttendeesOverview(): void {
    this.dashboardService.getAttendeesOverview(this.organizationId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (response) => {
        this.overview = asNamedValues(response.data);
      },
      error: (error) => {
        console.error('Error loading attendance trends:', error);
      },
    });
  }
}

function asNamedSeries(data: unknown): NamedSeries[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(isNamedSeries);
}

function asNamedValues(data: unknown): NamedValue[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(isNamedValue);
}

function isNamedSeries(value: unknown): value is NamedSeries {
  if (!isRecord(value) || typeof value['name'] !== 'string' || !Array.isArray(value['series'])) {
    return false;
  }
  return value['series'].every(isNamedValue);
}

function isNamedValue(value: unknown): value is NamedValue {
  return isRecord(value) && typeof value['name'] === 'string' && typeof value['value'] === 'number';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
