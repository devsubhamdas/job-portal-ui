import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { SearchJobsGQL, SearchJobsQuery } from '../../../generated/operations';

type Job = SearchJobsQuery['searchJobs'][number];

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private searchJobsGQL = inject(SearchJobsGQL);

  search(query: string) {
    return this.searchJobsGQL
      .watch({ variables: { input: { query } } })
      .valueChanges.pipe(map((result) => (result.data?.searchJobs ?? []) as Job[]));
  }
}
