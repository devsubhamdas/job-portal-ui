import { inject, Injectable } from '@angular/core';
import { AppliedJobsGQL, OwnedJobsGQL } from '../../../generated/operations';
import { map } from 'rxjs';
import { JobConnectionInput } from '../../../generated/schema';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ownedJobsGQL = inject(OwnedJobsGQL);
  private appliedJobsGQL = inject(AppliedJobsGQL);

  ownedJobs(payload: JobConnectionInput) {
    return this.ownedJobsGQL
      .fetch({ variables: { input: payload }, fetchPolicy: 'network-only' })
      .pipe(
        map((result) => ({
          data: result.data?.ownedJobs.data,
          hasMore: result.data?.ownedJobs.meta.hasMore as boolean,
          nextCursor: result.data?.ownedJobs.meta.nextCursor ?? null,
          error: result.error,
        })),
      );
  }

  appliedJobs(payload: JobConnectionInput) {
    return this.appliedJobsGQL
      .fetch({ variables: { input: payload }, fetchPolicy: 'network-only' })
      .pipe(
        map((result) => ({
          data: result.data?.appliedJobs.data,
          hasMore: result.data?.appliedJobs.meta.hasMore as boolean,
          nextCursor: result.data?.appliedJobs.meta.nextCursor ?? null,
          error: result.error,
        })),
      );
  }
}
