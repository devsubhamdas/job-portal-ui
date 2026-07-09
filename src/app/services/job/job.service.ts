import { inject, Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { map } from 'rxjs';
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
} from '../../../generated/schema';

type Job = SearchJobsQuery['searchJobs'][number];

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

  search(query: string) {
    this.searchQueryRef = this.searchJobsGQL.watch({
      variables: { input: { query } },
      fetchPolicy: 'network-only',
    });

    return this.searchQueryRef?.valueChanges.pipe(
      map((result) => ({
        data: (result.data?.searchJobs ?? []) as Job[],
        loading: result.loading,
        error: result.error,
      })),
    );
  }

  refetchSearch() {
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
