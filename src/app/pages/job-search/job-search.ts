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
import { LoginDialogService } from '../../services/login-dialog/login-dialog.service';
import { AuthService } from '../../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

type Job = SearchJobsQuery['searchJobs']['data'][number];

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
export class JobSearch implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('loadMoreTrigger') loadMoreTrigger!: ElementRef;
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
  loadingMore = signal<boolean>(false);
  searchResults = signal<Job[]>([]);
  cursor = signal<string | null>(null);
  hasMore = signal(true);
  limit = 10;

  applyForJobInProgress = signal(false);

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private destroyRef: DestroyRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginDialogService: LoginDialogService,
  ) {}

  ngOnInit(): void {
    this.handleSearchForJobs();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!this.hasMore() || this.searchResultsLoading()) {
          return;
        }
        this.loadMoreSearchResults();
      }
    });

    observer.observe(this.loadMoreTrigger.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  handleSearchForJobs() {
    this.searchControl.valueChanges
      .pipe(
        tap(() => {
          this.searchResultsLoading.set(true);
          this.cursor.set(null);
          this.searchResults.set([]);
          this.hasMore.set(true);
        }),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          const term = query?.trim() ?? '';
          if (!term || term.length < 2) {
            this.searchResults.set([]);
            this.searchResultsLoading.set(false);
            return EMPTY;
          }
          return this.jobService.search({
            query: term,
            limit: this.limit,
            cursor: this.cursor(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ data, loading, error, hasMore, cursor }) => {
          this.searchResultsLoading.set(loading);
          if (data) {
            this.hasMore.set(hasMore);
            this.cursor.set(cursor);
            this.searchResults.set(data);
          }
          if (error) console.error(error);
        },
        error: (err) => {
          console.error(err.message);
          this.searchResultsLoading.set(false);
        },
      });
  }

  async loadMoreSearchResults() {
    const term = this.searchControl.value?.trim() ?? '';

    if (this.searchResultsLoading() || this.loadingMore()) return;
    if (term.length < 2 || !this.hasMore() || !this.cursor()) return;

    this.loadingMore.set(true);

    try {
      await this.jobService.fetchMore(this.cursor()!);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingMore.set(false);
    }
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

  onApplyClick(id: string) {
    if (!this.authService.user()) {
      this.loginDialogService.open();
      return;
    }
    this.confirmApplyForJob(id);
  }
}
