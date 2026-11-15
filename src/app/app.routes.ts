import { Routes } from '@angular/router';

import { managerGuard } from './core/guards/manager.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news/news.routes').then((m) => m.NEWS_ROUTES),
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.routes').then((m) => m.EVENTS_ROUTES),
  },
  {
    // Only for Content Editors / Content Admins (the guard redirects everyone else to Home).
    path: 'manage',
    canActivate: [managerGuard],
    loadChildren: () => import('./features/manage/manage.routes').then((m) => m.MANAGE_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
