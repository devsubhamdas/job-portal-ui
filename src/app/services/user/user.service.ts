import { inject, Injectable } from '@angular/core';
import { OwnedJobsGQL } from '../../../generated/operations';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ownedJobsGQL = inject(OwnedJobsGQL);

  ownedJobs() {
    return this.ownedJobsGQL
      .fetch({ fetchPolicy: 'network-only' })
      .pipe(map((result) => ({ data: result.data?.me?.ownedJobs, error: result.error })));
  }
}
