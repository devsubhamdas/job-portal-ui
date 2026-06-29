import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { adminGuard } from './guards/admin/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/job-search/job-search').then((m) => m.JobSearch),
  },
  {
    path: 'applications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/applications/applications').then((m) => m.Applications),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
];
