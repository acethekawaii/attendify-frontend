import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { LucideAngularModule, CornerDownLeft, SearchCheck } from 'lucide-angular';
import { EventModel } from '@/app/features/events/models/event.model';
import { AttendanceModel } from '@/app/features/attendance/models/attendance.model';
import { EventRegistrationModel } from '@/app/features/events/models/event-registration.model';
import { CheckInAttendeeDto } from '@/app/features/attendance/dto/check-in-attendee.dto';
import { EventsService } from '@/app/features/events/services/events';
import { AttendanceService } from '@/app/features/attendance/services/attendance';
import { BsodLoading } from '@/app/shared/components/bsod-loading/bsod-loading';
import { ErrorCard } from "@/app/shared/components/error-card/error-card";

@Component({
  selector: 'app-event-manage',
  imports: [
    LucideAngularModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    CdkTableModule,
    MatFormFieldModule,
    MatInputModule,
    LucideAngularModule,
    DatePipe,
    MatButtonModule,
    BsodLoading,
    NgClass,
    ErrorCard,
],
  templateUrl: './event-manage.html',
  styleUrl: './event-manage.css'
})

export class EventManage {
  readonly SearchCheck = SearchCheck;
  readonly CornerDownLeft = CornerDownLeft;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);
  private attendanceService = inject(AttendanceService);
  private snackBar = inject(MatSnackBar);

  event: EventModel | null = null;
  private eventId: string | null = null

  registeredAttendeesColumns: string[] = ['fullName', 'primaryLeader', 'churchHierarchy','memberStatus', 'actions'];
  registeredAttendees = new MatTableDataSource<EventRegistrationModel>([]);
  @ViewChild('registeredPaginator')
  set registeredPaginator(paginator: MatPaginator) {
    this.registeredAttendees.paginator = paginator;
  }

  checkedInAttendeesColumns: string[] = ['fullName', 'primaryLeader', 'churchHierarchy', 'memberStatus', 'timeArrival'];
  checkedInAttendees = new MatTableDataSource<AttendanceModel>([]);
  @ViewChild('checkedInPaginator')
  set checkedInPaginator(paginator: MatPaginator) {
    this.checkedInAttendees.paginator = paginator;
  }

  overviewData = [
    { name: 'Registered Attendees', value: 0, },
    { name: 'Attendees (Overall)', value: 0,  },
    { name: 'Total VIP', value: 0, },
  ]

  isLoading = {
    event: false,
    registeredAttendees: false,
    checkedInAttendees: false,
    checkingIn: false
  }
  isEmpty = {
    registeredAttendees: false,
    checkedInAttendees: false,
  }

  private checkedInAttendeeIds = new Set<string>();

  private eventDataSub!: Subscription;

  ngOnInit(): void {
    
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (!this.eventId) return;
    this.loadInitialData(this.eventId);

    this.registeredAttendees.filterPredicate = (data: EventRegistrationModel, filter: string) => {
      const search = filter.toLowerCase();

      return (
        data.attendee.firstName.toLowerCase().includes(search) ||
        data.attendee.lastName.toLowerCase().includes(search)
      );
    };
  }

  ngOnDestroy(): void {
    this.eventDataSub?.unsubscribe();
  }
  
  private loadInitialData(eventId: string): void {
    this.setLoadingState(true);

    const event$ = this.eventsService.getEventById(eventId);
    const registered$ = this.eventsService.getRegisteredAttendees(eventId);
    const checkedIn$ = this.attendanceService.getAttendanceByEventId(eventId);

    this.eventDataSub = forkJoin({
      eventResponse: event$,
      registeredResponse: registered$,
      checkedInResponse: checkedIn$,
    }).subscribe({
      next: ({ eventResponse, registeredResponse, checkedInResponse }) => {
        this.event = eventResponse.data;

        this.checkedInAttendees.data = checkedInResponse.data;
        this.isEmpty.checkedInAttendees = checkedInResponse.data.length === 0
        this.overviewData[1].value = checkedInResponse.meta.total;
        this.overviewData[2].value = checkedInResponse.meta.totalVips;

        this.checkedInAttendeeIds.clear();
        checkedInResponse.data.forEach(registration => {
          this.checkedInAttendeeIds.add(registration.attendee.id);
        });

        this.registeredAttendees.data = registeredResponse.data;
        this.isEmpty.registeredAttendees = registeredResponse.data.length === 0;
        this.overviewData[0].value = registeredResponse.data.length;

        this.setLoadingState(false)
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.setLoadingState(false)
      }
    })
  }

  private setLoadingState(loading: boolean): void {
    this.isLoading.event = loading;
    this.isLoading.registeredAttendees = loading;
    this.isLoading.checkedInAttendees = loading;
  }

  onSearchRegisteredAttendees(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.registeredAttendees.filter = searchTerm.trim().toLowerCase();
  }

  onSearchCheckedInAttendees(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.checkedInAttendees.filter = searchTerm.trim().toLowerCase();
  }

  checkInAttendee(registration: EventRegistrationModel) {
    this.isLoading.checkingIn = true;
    if (!this.event) {
      console.log('Event data not loaded');
      return;
    }

    if (this.isCheckedIn(registration.attendee.id)) {
      console.log('Attendee is already checked in');
      return;
    }

    const eventTime = new Date(this.event.startTime);
    const now = new Date();
    const isLate = 
      now.getHours() > eventTime.getHours() ||
     (now.getHours() === eventTime.getHours() && now.getMinutes() >= eventTime.getMinutes());

    const dto: CheckInAttendeeDto = {
      eventRegistrationId: registration.id,
      isLate: isLate,
      attendeeId: registration.attendeeId,
      eventId: registration.eventId,
      organizationId: this.event.organizationId,
    };

    this.attendanceService.checkInAttendee(dto).subscribe({
      next: (response) => {
        console.log('Checked In', response);
        this.isLoading.checkingIn = false;
        this.openSnackBar();

        console.log(response.data)
        this.checkedInAttendees.data = [response.data, ...this.checkedInAttendees.data];
        console.log(this.checkedInAttendees.data)

        this.checkedInAttendeeIds.add(registration.attendee.id);
      },
      error: (err) => {
        console.error('Checked In failed', err)
        this.isLoading.checkingIn = false;
        this.snackBar.open(`Check-in failed: ${err.error?.message || 'Server error'}`, 'Close', {
          duration: 5000,
        });
      } 
    });
  }

  onCardClick(item: { name: string; value: number }) {
    if (item.name === 'Total VIP') {
      this.router.navigate([`/events/${this.event?.slug}/vip`]);
    }
  }

  isCheckedIn(attendeeId: string): boolean {
    return this.checkedInAttendeeIds.has(attendeeId);
  }

  openSnackBar() {
    this.snackBar.open('Checked In Successfully', 'Splash', {
      duration: 5000,
    });
  }
}