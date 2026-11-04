import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { NewsDetailPage } from './pages/news-detail-page/news-detail-page';
import { NewsListPage } from './pages/news-list-page/news-list-page';
import * as newsEffects from './store/news.effects';
import { newsFeature } from './store/news.feature';

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    // The news store is registered only when this feature is loaded.
    providers: [provideState(newsFeature), provideEffects(newsEffects)],
    children: [
      { path: '', component: NewsListPage },
      { path: ':id', component: NewsDetailPage },
    ],
  },
];
