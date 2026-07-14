import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { UserService } from '../../services/user/user.service';
import { AppliedJobsQuery } from '../../../generated/operations';
import { finalize, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { JobService } from '../../services/job/job.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';

type Job = NonNullable<AppliedJobsQuery['appliedJobs']['data']>[number];

@Component({
  selector: 'app-applications',
  imports: [DividerModule, JobCard, NotFoundCard],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;
  btnOption = {
    label: 'Cancel',
    size: BtnSize.Small,
    severity: BtnSeverity.Secondary,
  };

  appliedJobsResultLoading = signal(false);
  appliedJobsResult = signal<Job[]>([]);
  readonly authUser: typeof this.authService.user;

  cancelJobApplicationInProgress = signal(false);

  limit = 10;
  hasMore = signal(true);
  cursor = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jobService: JobService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private destroyRef: DestroyRef,
  ) {
    this.authUser = this.authService.user;
  }

  ngOnInit(): void {
    this.fetchAppliedJobs();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.appliedJobsResultLoading() || !this.hasMore()) return;
        this.fetchAppliedJobs();
      }
    });
    observer.observe(this.loadMoreTrigger.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  fetchAppliedJobs(reset = false) {
    if (reset) {
      this.appliedJobsResult.set([]);
      this.hasMore.set(true);
      this.cursor.set(null);
    }
    this.appliedJobsResultLoading.set(true);
    this.userService
      .appliedJobs({ cursor: this.cursor(), limit: this.limit })
      .pipe(
        finalize(() => {
          this.appliedJobsResultLoading.set(false);
        }),
      )
      .subscribe({
        next: ({ data, error, hasMore, nextCursor }) => {
          if (data) {
            if (reset) {
              this.appliedJobsResult.set(data);
            } else {
              this.appliedJobsResult.update((prev) => [...prev, ...data]);
            }
            this.cursor.set(nextCursor);
            this.hasMore.set(hasMore);
          }
          if (error) console.error(error);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  handleCancelJobApplication(id: string) {
    this.cancelJobApplicationInProgress.set(true);
    this.jobService
      .cancel({ id })
      .pipe(finalize(() => this.cancelJobApplicationInProgress.set(false)))
      .subscribe({
        next: ({ data, error, loading }) => {
          this.cancelJobApplicationInProgress.set(loading);
          if (data) {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Application Cancelled',
            });
            this.fetchAppliedJobs(true);
          }
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to cancel application',
            });
            console.error(error);
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to cancel application',
          });
        },
      });
  }

  confirmCancelJobApplication(id: string) {
    this.confirmationService.confirm({
      header: 'Cancel Job Application',
      message: 'Are you sure you want to cancel this job application?',
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Close',
        severity: 'secondary',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Proceed',
        severity: 'danger',
        size: 'small',
      },

      accept: () => {
        this.handleCancelJobApplication(id);
      },
    });
  }
}
