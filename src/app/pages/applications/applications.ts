import { Component, OnInit, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { UserService } from '../../services/user/user.service';
import { AppliedJobsQuery } from '../../../generated/operations';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

type Job = NonNullable<AppliedJobsQuery['appliedJobs']>[number];

@Component({
  selector: 'app-applications',
  imports: [DividerModule, JobCard, NotFoundCard],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {
  btnOption = { label: 'Cancel', size: BtnSize.Small, severity: BtnSeverity.Secondary };

  appliedJobsResultLoading = signal(false);
  appliedJobsResult = signal<Job[]>([]);
  readonly authUser: typeof this.authService.user;

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
}
