import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { HomePage } from './pages/home-page/home-page';
import * as homeEffects from './store/home.effects';
import { homeFeature } from './store/home.feature';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePage,
    // The home store is registered only when this feature is loaded.
    providers: [provideState(homeFeature), provideEffects(homeEffects)],
  },
];
