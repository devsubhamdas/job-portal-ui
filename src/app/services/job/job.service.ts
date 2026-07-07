import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { CreateJobGQL, SearchJobsGQL, SearchJobsQuery } from '../../../generated/operations';
import { CreateJobInput } from '../../../generated/schema';

type Job = SearchJobsQuery['searchJobs'][number];

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private searchJobsGQL = inject(SearchJobsGQL);
  private createJobGQL = inject(CreateJobGQL);

  search(query: string) {
    return this.searchJobsGQL
      .watch({ variables: { input: { query } }, fetchPolicy: 'network-only' })
      .valueChanges.pipe(
        map((result) => ({
          data: (result.data?.searchJobs ?? []) as Job[],
          loading: result.loading,
          error: result.error,
        })),
      );
  }

  create(payload: CreateJobInput) {
    return this.createJobGQL.mutate({ variables: { input: payload } }).pipe(
      map((result) => ({
        data: result.data?.createJob,
        loading: result.loading as boolean,
        error: result.error,
      })),
    );
  }
}
