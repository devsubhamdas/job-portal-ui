import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'applications', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
