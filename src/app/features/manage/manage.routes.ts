import { Routes } from '@angular/router';

/**
 * /manage            → list of news + events (tabs)
 * /manage/news/new   → create news         /manage/news/:id   → edit news
 * /manage/events/new → create event        /manage/events/:id → edit event
 * "new" routes are listed BEFORE ":id", otherwise "new" would be read as an id.
 */
export const MANAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/manage-dashboard/manage-dashboard').then((m) => m.ManageDashboardPage),
  },
  {
    path: 'news/new',
    loadComponent: () => import('./pages/news-form/news-form').then((m) => m.NewsFormPage),
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./pages/news-form/news-form').then((m) => m.NewsFormPage),
  },
  {
    path: 'events/new',
    loadComponent: () => import('./pages/event-form/event-form').then((m) => m.EventFormPage),
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./pages/event-form/event-form').then((m) => m.EventFormPage),
  },
];
