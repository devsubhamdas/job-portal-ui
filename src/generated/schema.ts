export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
};

export type ApplyForJobInput = {
  id: Scalars['ID']['input'];
};

export type CancleJobApplicationInput = {
  id: Scalars['ID']['input'];
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateJobInput = {
  companyName: Scalars['String']['input'];
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  remote: Scalars['Boolean']['input'];
  salary: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  type: JobType;
};

export type DeleteJobInput = {
  id: Scalars['ID']['input'];
};

export type Job = {
  __typename?: 'Job';
  company: Company;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isApplied?: Maybe<Scalars['Boolean']['output']>;
  location: Scalars['String']['output'];
  remote: Scalars['Boolean']['output'];
  salary: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  type: JobType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum JobType {
  FullTime = 'FULL_TIME',
  Internship = 'INTERNSHIP',
  PartTime = 'PART_TIME'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  applyForJob: Scalars['Boolean']['output'];
  cancelJobApplication: Scalars['Boolean']['output'];
  createJob: Job;
  deleteJob: Scalars['Boolean']['output'];
  login: User;
  logout: Scalars['Boolean']['output'];
  signup: User;
};


export type MutationApplyForJobArgs = {
  input: ApplyForJobInput;
};


export type MutationCancelJobApplicationArgs = {
  input: CancleJobApplicationInput;
};


export type MutationCreateJobArgs = {
  input: CreateJobInput;
};


export type MutationDeleteJobArgs = {
  input: DeleteJobInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};

export type Query = {
  __typename?: 'Query';
  appliedJobs: Array<Job>;
  getCompanies: Array<Company>;
  me?: Maybe<User>;
  ownedJobs: Array<Job>;
  searchJobs: Array<Job>;
};


export type QuerySearchJobsArgs = {
  input: SearchJobsInput;
};

export type SearchJobsInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type User = {
  __typename?: 'User';
  appliedJobs?: Maybe<Array<Job>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ownedJobs?: Maybe<Array<Job>>;
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}
