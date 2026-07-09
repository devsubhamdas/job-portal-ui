import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { JobCard } from '../../components/job-card/job-card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BtnSeverity, BtnSize, BtnVariant } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobService } from '../../services/job/job.service';
import { SearchJobsQuery } from '../../../generated/operations';
import { ConfirmationService, MessageService } from 'primeng/api';

type Job = SearchJobsQuery['searchJobs'][number];

@Component({
  selector: 'app-job-search',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    JobCard,
    NotFoundCard,
  ],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch implements OnInit {
  applyForJobInProgress = signal(false);
  readonly BtnSeverity = BtnSeverity;
  readonly BtnSize = BtnSize;
  readonly BtnVariant = BtnVariant;

  btnOption = {
    label: 'Apply',
    size: BtnSize.Small,
    severity: BtnSeverity.Secondary,
  };

  searchControl = new FormControl('');
  searchResultsLoading = signal<boolean>(false);
  searchResults = signal<Job[]>([]);

  constructor(
    private jobService: JobService,
    private destroyRef: DestroyRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        tap(() => this.searchResultsLoading.set(true)),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          const term = query?.trim() ?? '';
          if (!term || term.length < 2) {
            this.searchResults.set([]);
            this.searchResultsLoading.set(false);
            return EMPTY;
          }
          return this.jobService.search(term);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ data, loading, error }) => {
          this.searchResultsLoading.set(loading);
          if (data) this.searchResults.set(data);
          if (error) console.error(error);
        },
        error: (err) => {
          console.error(err.message);
          this.searchResultsLoading.set(false);
        },
      });
  }

  handleApplyForJob(id: string) {
    this.applyForJobInProgress.set(true);
    this.jobService
      .apply({ id })
      .pipe(finalize(() => this.applyForJobInProgress.set(false)))
      .subscribe({
        next: ({ data, loading, error }) => {
          this.applyForJobInProgress.set(loading);
          if (data) {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Application Submitted',
            });
          }
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to submit application',
            });
            console.error(error);
          }
          this.jobService.refetchSearch();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit application',
          });
        },
      });
  }

  confirmApplyForJob(id: string) {
    this.confirmationService.confirm({
      header: 'Apply for Job',
      message: 'Are you sure you want to apply for this job?',
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Close',
        severity: 'secondary',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Apply',
        severity: 'contrast',
        size: 'small',
      },

      accept: () => {
        this.handleApplyForJob(id);
      },
    });
  }
}
