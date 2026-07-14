import { inject, Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { filter, map } from 'rxjs';
import {
  ApplyForJobGQL,
  CancelJobApplicationGQL,
  CreateJobGQL,
  DeleteJobGQL,
  SearchJobsGQL,
  SearchJobsQuery,
  SearchJobsQueryVariables,
} from '../../../generated/operations';
import {
  ApplyForJobInput,
  CancleJobApplicationInput,
  CreateJobInput,
  DeleteJobInput,
  SearchJobsInput,
} from '../../../generated/schema';

type Job = SearchJobsQuery['searchJobs']['data'][number];

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private searchJobsGQL = inject(SearchJobsGQL);
  private createJobGQL = inject(CreateJobGQL);
  private applyForJobGQL = inject(ApplyForJobGQL);
  private cancelJobApplicationGQL = inject(CancelJobApplicationGQL);
  private deleteJobGQL = inject(DeleteJobGQL);

  private searchQueryRef?: QueryRef<SearchJobsQuery, SearchJobsQueryVariables>;

  search(payload: SearchJobsInput) {
    const { query, limit, cursor } = payload;
    this.searchQueryRef = this.searchJobsGQL.watch({
      variables: { input: { query, limit, cursor } },
      fetchPolicy: 'network-only',
    });

    return this.searchQueryRef?.valueChanges.pipe(
      filter((result) => !result.loading),
      map((result) => ({
        data: (result.data?.searchJobs?.data ?? []) as Job[],
        loading: result.loading,
        error: result.error,
        hasMore: result.data?.searchJobs?.meta?.hasMore as boolean,
        cursor: result.data?.searchJobs?.meta?.nextCursor ?? null,
      })),
    );
  }

  fetchMore(cursor: string) {
    if (!this.searchQueryRef) {
      throw new Error('Search query has not been initialized.');
    }

    return this.searchQueryRef.fetchMore({
      variables: {
        input: {
          ...this.searchQueryRef.variables.input,
          cursor,
        },
      },
    });
  }

  refetch() {
    return this.searchQueryRef?.refetch();
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

  apply(payload: ApplyForJobInput) {
    return this.applyForJobGQL.mutate({ variables: { input: payload } }).pipe(
      map((result) => ({
        data: result.data?.applyForJob,
        error: result.error,
        loading: result.loading as boolean,
      })),
    );
  }

  cancel(payload: CancleJobApplicationInput) {
    return this.cancelJobApplicationGQL.mutate({ variables: { input: payload } }).pipe(
      map((result) => ({
        data: result.data?.cancelJobApplication,
        loading: result.loading as boolean,
        error: result.error,
      })),
    );
  }

  delete(payload: DeleteJobInput) {
    return this.deleteJobGQL.mutate({ variables: { input: payload } }).pipe(
      map((result) => ({
        data: result.data?.deleteJob,
        error: result.error,
        loading: result.loading as boolean,
      })),
    );
  }
}
