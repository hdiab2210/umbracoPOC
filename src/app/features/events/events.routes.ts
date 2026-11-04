import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { EventDetailPage } from './pages/event-detail-page/event-detail-page';
import { EventsListPage } from './pages/events-list-page/events-list-page';
import * as eventsEffects from './store/events.effects';
import { eventsFeature } from './store/events.feature';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    // The events store is registered only when this feature is loaded.
    providers: [provideState(eventsFeature), provideEffects(eventsEffects)],
    children: [
      { path: '', component: EventsListPage },
      { path: ':id', component: EventDetailPage },
    ],
  },
];
