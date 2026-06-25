import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { JobCard } from '../../components/job-card/job-card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BtnSeverity, BtnSize, BtnVariant } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobService } from '../../services/job/job.service';
import { SearchJobsQuery } from '../../../generated/operations';
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
  readonly BtnSeverity = BtnSeverity;
  readonly BtnSize = BtnSize;
  readonly BtnVariant = BtnVariant;
  btnOption = { label: 'Apply', size: BtnSize.Small, severity: BtnSeverity.Secondary };

  searchControl = new FormControl('');
  searchResultsLoading = signal<boolean>(false);
  searchResults = signal<Job[]>([]);

  constructor(
    private jobService: JobService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((query) => !!query && query.length >= 2),
        switchMap((query) => {
          const term = query?.trim() ?? '';
          this.searchResultsLoading.set(true);
          return this.jobService.search(term);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          this.searchResultsLoading.set(false);
          this.searchResults.set(data);
          console.log(data);
        },
        error: (err) => console.log(err.message),
      });
  }

  handleClick() {
    console.log('hello');
  }
}
