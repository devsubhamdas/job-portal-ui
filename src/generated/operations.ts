/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './schema';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
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

export type SearchJobsQueryVariables = Exact<{
  input: Types.SearchJobsInput;
}>;


export type SearchJobsQuery = { searchJobs: Array<{ id: string, title: string, description: string, location: string, salary: number, type: Types.JobType, remote: boolean, createdAt: Date, company: { id: string, name: string } }> };

export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    id
    name
    email
    role
  }
}
    `;

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
    id
    name
    email
    role
  }
}
    `;

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
    id
    name
    email
    role
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignupGQL extends Apollo.Mutation<SignupMutation, SignupMutationVariables> {
    override document = SignupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
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
    providedIn: 'root'
  })
  export class SearchJobsGQL extends Apollo.Query<SearchJobsQuery, SearchJobsQueryVariables> {
    override document = SearchJobsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }