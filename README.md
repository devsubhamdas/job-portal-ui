# JobPortal UI

Frontend application for a job portal platform built with **Angular, Apollo Client, GraphQL, and WebSockets**.

The application allows users to browse and apply for jobs, create and manage job postings, track applications, and receive real-time notifications.

## Features

- 🔐 User authentication
- 💼 Browse and search job postings
- 📢 Create and manage job postings
- 📄 Apply for jobs
- 📊 Track posted and applied jobs
- 🔔 Real-time notifications using WebSockets
- 🚀 GraphQL integration with Apollo Client
- 📱 Responsive user interface

## Tech Stack

- Angular
- TypeScript
- Apollo Client
- GraphQL
- WebSockets
- PrimeNG
- Tailwind CSS
- RxJS

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/devsubhamdas/job-portal-ui
cd job-portal-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Configure the GraphQL API and WebSocket endpoints in the application's environment configuration to point to the **JobPortal API**.

### 4. Start the development server

```bash
npm start
```

The application will be available at:

```text
http://localhost:4200
```

## Production Build

Build the application:

```bash
npm run build
```

For SSR:

```bash
npm run serve:ssr:client
```

## Code Generation

GraphQL types and Apollo services are generated from the GraphQL schema and operations.

Run:

```bash
npm run codegen
```

To watch for changes:

```bash
npm run codegen:watch
```

## Related Project

This frontend works with the **JobPortal API**, which provides authentication, job management, applications, and real-time notifications.

## Associated Repository

**Jobportal Backend**: [job-portal-api-graphql]("https://github.com/devsubhamdas/job-portal-api-graphql")

## Project Purpose

JobPortal UI provides a user-friendly interface for a complete job recruitment platform, allowing users to discover and apply for jobs, post and manage job listings, track applications, and receive real-time notifications.
