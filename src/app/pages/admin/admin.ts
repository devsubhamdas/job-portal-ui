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
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { ButtonModule } from 'primeng/button';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { JobService } from '../../services/job/job.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../services/user/user.service';
import { OwnedJobsQuery } from '../../../generated/operations';
import { finalize } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Job = NonNullable<OwnedJobsQuery['ownedJobs']['data']>[number];

interface JobType {
  label: string;
  value: string;
}

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    JobCard,
    ButtonModule,
    NotFoundCard,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    RadioButtonModule,
    AutoFocusModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;
  btnOption = {
    label: 'Remove',
    size: BtnSize.Small,
    severity: BtnSeverity.Danger,
  };

  createJobDialogVisibility: boolean = false;
  createJobForm: FormGroup;
  formSubmitAttempted: boolean = false;
  jobTypeOptions: JobType[] = [];

  ownedJobsResult = signal<Job[]>([]);
  ownedJobsResultLoading = signal(false);
  cursor = signal<string | null>(null);
  hasMore = signal(true);
  limit = 10;

  createJobInProgress = signal<boolean>(false);
  deleteJobInProgress = signal(false);

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private destroyRef: DestroyRef,
  ) {
    this.createJobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      salary: [null, Validators.required],
      type: ['', Validators.required],
      remote: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.jobTypeOptions = [
      {
        label: 'Full-time',
        value: 'FULL_TIME',
      },
      {
        label: 'Part-time',
        value: 'PART_TIME',
      },
      {
        label: 'Internship',
        value: 'INTERNSHIP',
      },
    ];

    this.fetchOwnedJobs();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.ownedJobsResultLoading() || !this.hasMore()) return;
        this.fetchOwnedJobs();
      }
    });
    observer.observe(this.loadMoreTrigger.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  fetchOwnedJobs(reset = false) {
    if (reset) {
      this.ownedJobsResult.set([]);
      this.hasMore.set(true);
      this.cursor.set(null);
    }
    this.ownedJobsResultLoading.set(true);
    this.userService
      .ownedJobs({ cursor: this.cursor(), limit: this.limit })
      .pipe(
        finalize(() => this.ownedJobsResultLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ data, error, hasMore, nextCursor }) => {
          if (data) {
            if (reset) {
              this.ownedJobsResult.set(data);
            } else {
              this.ownedJobsResult.update((prev) => [...prev, ...data]);
            }
            this.hasMore.set(hasMore);
            this.cursor.set(nextCursor);
          }
          if (error) console.error(error);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  handleCreateJob(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.createJobForm.invalid) {
      return;
    }

    const payload = this.createJobForm.getRawValue();
    this.createJobInProgress.set(true);
    this.jobService
      .create(payload)
      .pipe(
        finalize(() => this.createJobInProgress.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ data, error, loading }) => {
          this.createJobInProgress.set(loading);
          if (data) {
            this.createJobForm.reset();
            this.createJobDialogVisibility = false;
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Job Created',
            });
            this.fetchOwnedJobs(true);
          }
          if (error) {
            console.error(error);
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create job',
          });
        },
      });
  }

  handleDeleteJob(id: string) {
    this.deleteJobInProgress.set(true);
    this.jobService
      .delete({ id })
      .pipe(
        finalize(() => this.deleteJobInProgress.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ data, error, loading }) => {
          this.deleteJobInProgress.set(loading);
          if (data) {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Job Deleted',
            });
            //update local state instead of refetch
            this.ownedJobsResult.update((prev) => prev.filter((job) => job.id !== id));
          }
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete job',
            });
            console.error(error);
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete job',
          });
        },
      });
  }

  confirmDeleteJob(id: string) {
    this.confirmationService.confirm({
      header: 'Delete Job Post',
      message: 'Are you sure you want to delete this job post?',
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Close',
        severity: 'secondary',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Confirm',
        severity: 'danger',
        size: 'small',
      },

      accept: () => {
        this.handleDeleteJob(id);
      },
    });
  }

  showCreateJobDialog() {
    this.createJobDialogVisibility = true;
  }

  onDialogHide() {
    this.formSubmitAttempted = false;
    this.createJobForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.createJobForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty || this.formSubmitAttempted);
  }

  get title() {
    return this.createJobForm.controls['title'];
  }
  get description() {
    return this.createJobForm.controls['description'];
  }
  get companyName() {
    return this.createJobForm.controls['companyName'];
  }
  get location() {
    return this.createJobForm.controls['location'];
  }
  get salary() {
    return this.createJobForm.controls['salary'];
  }
  get type() {
    return this.createJobForm.controls['type'];
  }
  get remote() {
    return this.createJobForm.controls['remote'];
  }
}
