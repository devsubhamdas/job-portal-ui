import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/job-search/job-search').then((m) => m.JobSearch),
  },
  {
    path: 'applications',
    loadComponent: () => import('./pages/applications/applications').then((m) => m.Applications),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
];
