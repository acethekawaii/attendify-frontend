import { Component, inject, ViewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CdkTableModule } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { CornerDownLeft, LucideAngularModule, SearchCheck } from 'lucide-angular';

import { AttendanceService } from '@/app/features/attendance/services/attendance';
import { DEFAULT_DATE_FORMAT } from '@/app/shared/utils/date-format';
import { ErrorCard } from '@/app/shared/components/error-card/error-card';
import { environment } from '@/environments/environment';
import { EventsService } from '@/app/features/events/services/events';
import { EventModel } from '@/app/features/events/models/event.model';

@Component({
  selector: 'app-attendance-detail',
  imports: [
    RouterLink,
    DatePipe,
    CdkTableModule,
    MatFormFieldModule,
    MatInputModule,
    LucideAngularModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginator,
    NgClass,
    ErrorCard,
  ],
  providers: [provideMomentDateAdapter(DEFAULT_DATE_FORMAT)],
  templateUrl: './attendance-detail.html',
  styleUrl: './attendance-detail.css'
})

export class AttendanceDetail {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  readonly CornerDownLeft = CornerDownLeft;
  readonly SearchCheck = SearchCheck;

  readonly organizationId = environment.organizationId;
  readonly date = new FormControl(moment(), { nonNullable: true });

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private attendanceService = inject(AttendanceService);
  private eventsService = inject(EventsService);

  slug = this.route.snapshot.paramMap.get('slug');

  displayedColumns: string[] = ['fullName', 'primaryLeader', 'churchProcess', 'memberStatus', 'arival'];
  attendanceDataSource = new MatTableDataSource<any>([]);
  currentSearchTerm: string | undefined = undefined;
  attendance = {
    totalCount: 0,
    loading: false,
    errorMessage: null,
    empty: false,
  }
  currentPage = 1;
  pageLimit = 10;  

  event: EventModel | null = null;
  isEventLoading = false;

  overviewData = [
    { name: 'Attendees (Overall)', value: 0 },
    { name: 'Total VIP', value: 0 }
  ];

  ngOnInit(): void {
    if (!this.slug) return;

    const lastSunday = moment().day(0);
    this.date.setValue(lastSunday);

    this.date.valueChanges.subscribe(() => {
      this.paginator.firstPage();
      this.loadAttendanceRecord();
    })

    this.loadAttendanceRecord(1, 10, undefined, true);
    this.loadEvent(this.slug);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAttendanceRecord(
    page: number = 1, 
    limit: number = 10, 
    searchTerm?: string,
    forceRefresh: boolean = false,
  ): void {
    if (!this.slug) return;

    this.attendance.loading = true;
    this.attendance.errorMessage = null; 
    this.attendance.empty = false;
    const formattedDate = this.date.value.format('YYYY-MM-DD');

    this.attendanceService.getAttendanceRecord(this.organizationId, this.slug, formattedDate, page, limit, searchTerm, forceRefresh).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.attendanceDataSource.data = response.data;
        this.attendance.totalCount = response.meta.total;
        this.attendance.loading = false;
        this.attendance.empty = response.data.length === 0;
        this.overviewData = [
          { name: 'Attendees (Overall)', value: response.meta.total },
          { name: 'Total VIP', value: response.meta.totalVips }
        ];

        this.attendanceService.prefetchNextPage(
          this.organizationId,
          this.slug!,
          formattedDate,
          this.currentPage,
          this.pageLimit,
          this.attendance.totalCount,
          this.currentSearchTerm
        );
      },
      error: (error) => {event
        console.error('Error loading attendance record:', error);
        this.attendance.loading = false;
        this.attendance.errorMessage = error?.error?.message ?? 'An unknown error occurred.';
        this.attendance.totalCount = 0;
        this.attendanceDataSource.data = [];
      }
    })
  }

   private loadEvent(slug: string) {
      this.isEventLoading = true;
  
      this.eventsService.getEventBySlug(slug).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.event = response.data;
          this.isEventLoading = false;
          console.log(this.event)
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.isEventLoading = false;
        }
      })
    }

  onCardClick(item: { name: string; value: number }) {
    const formattedDate = this.date.value.format('YYYY-MM-DD');

    if (item.name === 'Total VIP') {
      this.router.navigate([`/attendance/${this.slug}/vip/${formattedDate}`]);
    }
  }

  onSearchAttendanceRecord(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.currentSearchTerm = searchTerm ? searchTerm : undefined;

    if (this.paginator && this.paginator.pageIndex !== 0) {
      this.paginator.firstPage();
    }else {
      this.loadAttendanceRecord(1, this.pageLimit, searchTerm ? searchTerm : undefined);
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    console.log('page-change', this.currentPage);
    this.pageLimit = event.pageSize;
    this.loadAttendanceRecord(this.currentPage, this.pageLimit, this.currentSearchTerm)
  }
}
