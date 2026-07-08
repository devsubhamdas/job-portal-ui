import { Component, OnInit, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { UserService } from '../../services/user/user.service';
import { AppliedJobsQuery } from '../../../generated/operations';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { JobService } from '../../services/job/job.service';
import { ConfirmationService, MessageService } from 'primeng/api';

type Job = NonNullable<AppliedJobsQuery['appliedJobs']>[number];

@Component({
  selector: 'app-applications',
  imports: [DividerModule, JobCard, NotFoundCard],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {
  cancelJobApplicationInProgress = signal(false);
  btnOption = {
    label: 'Cancel',
    size: BtnSize.Small,
    severity: BtnSeverity.Secondary,
  };

  appliedJobsResultLoading = signal(false);
  appliedJobsResult = signal<Job[]>([]);
  readonly authUser: typeof this.authService.user;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jobService: JobService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.authUser = this.authService.user;
  }

  ngOnInit(): void {
    this.fetchAppliedJobs();
  }

  fetchAppliedJobs() {
    this.appliedJobsResultLoading.set(true);
    this.userService
      .appliedJobs()
      .pipe(
        finalize(() => {
          this.appliedJobsResultLoading.set(false);
        }),
      )
      .subscribe({
        next: ({ data, error }) => {
          console.log(data);
          if (data) this.appliedJobsResult.set(data);
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
            this.fetchAppliedJobs();
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
