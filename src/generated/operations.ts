/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './schema';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type SearchJobsQueryVariables = Exact<{
  input: Types.SearchJobsInput;
}>;

export type SearchJobsQuery = {
  searchJobs: Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    type: Types.JobType;
    remote: boolean;
    createdAt: unknown;
    company: { id: string; name: string };
  }>;
};

export const SearchJobsDocument = gql`
  query SearchJobs($input: SearchJobsInput!) {
    searchJobs(input: $input) {
      id
      title
      description
      location
      salary
      type
      remote
      createdAt
      company {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SearchJobsGQL extends Apollo.Query<SearchJobsQuery, SearchJobsQueryVariables> {
  override document = SearchJobsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
