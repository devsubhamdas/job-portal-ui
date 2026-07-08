import { Component, OnInit, signal } from '@angular/core';
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

type Job = NonNullable<OwnedJobsQuery['ownedJobs']>[number];

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
export class Admin implements OnInit {
  deleteJobInProgress = signal(false);
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
  createJobInProgress = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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

  onSubmit(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.createJobForm.invalid) {
      console.log('clicked');
      return;
    }

    const payload = this.createJobForm.getRawValue();
    this.createJobInProgress.set(true);
    this.jobService.create(payload).subscribe({
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
          this.fetchOwnedJobs();
        }
        if (error) {
          console.error(error);
        }
      },
      error: (err) => {
        console.error(err);
        this.createJobInProgress.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create job',
        });
      },
    });
  }

  fetchOwnedJobs() {
    this.ownedJobsResultLoading.set(true);
    this.userService
      .ownedJobs()
      .pipe(finalize(() => this.ownedJobsResultLoading.set(false)))
      .subscribe({
        next: ({ data, error }) => {
          if (data) this.ownedJobsResult.set(data);
          if (error) console.error(error);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  handleDeleteJob(id: string) {
    this.deleteJobInProgress.set(true);
    this.jobService
      .delete({ id })
      .pipe(finalize(() => this.deleteJobInProgress.set(false)))
      .subscribe({
        next: ({ data, error, loading }) => {
          this.deleteJobInProgress.set(loading);
          if (data) {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Job Deleted',
            });
            this.fetchOwnedJobs();
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
