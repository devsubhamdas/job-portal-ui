/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './schema';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type UserFragment = { id: string, name: string, email: string, role: Types.UserRole };

export type LoginMutationVariables = Exact<{
  input: Types.LoginInput;
}>;


export type LoginMutation = { login: { id: string, name: string, email: string, role: Types.UserRole } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, name: string, email: string, role: Types.UserRole } | null };

export type SignupMutationVariables = Exact<{
  input: Types.SignupInput;
}>;


export type SignupMutation = { signup: { id: string, name: string, email: string, role: Types.UserRole } };

export type CreateJobMutationVariables = Exact<{
  input: Types.CreateJobInput;
}>;


export type CreateJobMutation = { createJob: { id: string, title: string, description: string, type: Types.JobType, remote: boolean, company: { id: string, name: string } } };

export type ApplyForJobMutationVariables = Exact<{
  input: Types.ApplyForJobInput;
}>;


export type ApplyForJobMutation = { applyForJob: boolean };

export type CancelJobApplicationMutationVariables = Exact<{
  input: Types.CancleJobApplicationInput;
}>;


export type CancelJobApplicationMutation = { cancelJobApplication: boolean };

export type DeleteJobMutationVariables = Exact<{
  input: Types.DeleteJobInput;
}>;


export type DeleteJobMutation = { deleteJob: boolean };

export type SearchJobsQueryVariables = Exact<{
  input: Types.SearchJobsInput;
}>;


export type SearchJobsQuery = { searchJobs: { data: Array<{ id: string, title: string, description: string, location: string, salary: number, type: Types.JobType, remote: boolean, isApplied: boolean | null, createdAt: Date, company: { id: string, name: string } }>, meta: { hasMore: boolean, nextCursor: string | null } } };

export type CompanyFragment = { id: string, name: string };

export type JobFragment = { id: string, title: string, description: string, location: string, salary: number, type: Types.JobType, remote: boolean, createdAt: Date };

export type OwnedJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type OwnedJobsQuery = { ownedJobs: Array<{ id: string, title: string, description: string, location: string, salary: number, type: Types.JobType, remote: boolean, createdAt: Date, company: { id: string, name: string } }> };

export type AppliedJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppliedJobsQuery = { appliedJobs: Array<{ id: string, title: string, description: string, location: string, salary: number, type: Types.JobType, remote: boolean, createdAt: Date, company: { id: string, name: string } }> };

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  name
  email
  role
}
    `;
export const CompanyFragmentDoc = gql`
    fragment Company on Company {
  id
  name
}
    `;
export const JobFragmentDoc = gql`
    fragment Job on Job {
  id
  title
  description
  location
  salary
  type
  remote
  createdAt
}
    `;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    override document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogoutGQL extends Apollo.Mutation<LogoutMutation, LogoutMutationVariables> {
    override document = LogoutDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query Me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    override document = MeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignupDocument = gql`
    mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SignupGQL extends Apollo.Mutation<SignupMutation, SignupMutationVariables> {
    override document = SignupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateJobDocument = gql`
    mutation CreateJob($input: CreateJobInput!) {
  createJob(input: $input) {
    id
    title
    description
    company {
      id
      name
    }
    type
    remote
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateJobGQL extends Apollo.Mutation<CreateJobMutation, CreateJobMutationVariables> {
    override document = CreateJobDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ApplyForJobDocument = gql`
    mutation ApplyForJob($input: ApplyForJobInput!) {
  applyForJob(input: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ApplyForJobGQL extends Apollo.Mutation<ApplyForJobMutation, ApplyForJobMutationVariables> {
    override document = ApplyForJobDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CancelJobApplicationDocument = gql`
    mutation CancelJobApplication($input: CancleJobApplicationInput!) {
  cancelJobApplication(input: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CancelJobApplicationGQL extends Apollo.Mutation<CancelJobApplicationMutation, CancelJobApplicationMutationVariables> {
    override document = CancelJobApplicationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteJobDocument = gql`
    mutation DeleteJob($input: DeleteJobInput!) {
  deleteJob(input: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteJobGQL extends Apollo.Mutation<DeleteJobMutation, DeleteJobMutationVariables> {
    override document = DeleteJobDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchJobsDocument = gql`
    query SearchJobs($input: SearchJobsInput!) {
  searchJobs(input: $input) {
    data {
      id
      title
      description
      location
      salary
      type
      remote
      isApplied
      createdAt
      company {
        id
        name
      }
    }
    meta {
      hasMore
      nextCursor
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchJobsGQL extends Apollo.Query<SearchJobsQuery, SearchJobsQueryVariables> {
    override document = SearchJobsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OwnedJobsDocument = gql`
    query OwnedJobs {
  ownedJobs {
    ...Job
    company {
      ...Company
    }
  }
}
    ${JobFragmentDoc}
${CompanyFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class OwnedJobsGQL extends Apollo.Query<OwnedJobsQuery, OwnedJobsQueryVariables> {
    override document = OwnedJobsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AppliedJobsDocument = gql`
    query AppliedJobs {
  appliedJobs {
    ...Job
    company {
      ...Company
    }
  }
}
    ${JobFragmentDoc}
${CompanyFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AppliedJobsGQL extends Apollo.Query<AppliedJobsQuery, AppliedJobsQueryVariables> {
    override document = AppliedJobsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }