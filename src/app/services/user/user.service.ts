import { inject, Injectable } from '@angular/core';
import { AppliedJobsGQL, OwnedJobsGQL } from '../../../generated/operations';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ownedJobsGQL = inject(OwnedJobsGQL);
  private appliedJobsGQL = inject(AppliedJobsGQL);

  ownedJobs() {
    return this.ownedJobsGQL
      .fetch({ fetchPolicy: 'network-only' })
      .pipe(map((result) => ({ data: result.data?.ownedJobs, error: result.error })));
  }

  appliedJobs() {
    return this.appliedJobsGQL
      .fetch({ fetchPolicy: 'network-only' })
      .pipe(map((result) => ({ data: result.data?.appliedJobs, error: result.error })));
  }
}
