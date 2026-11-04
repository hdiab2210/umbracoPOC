import { createFeature, createReducer, on } from '@ngrx/store';

import { EventItemContent, HomeContent, NewsItemContent } from '../../../core/models/umbraco.models';
import { HomeActions } from './home.actions';

export interface HomeState {
  home: HomeContent | null;
  latestNews: NewsItemContent[];
  upcomingEvents: EventItemContent[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  home: null,
  latestNews: [],
  upcomingEvents: [],
  loading: false,
  error: null,
};

/** Reducer + auto-generated selectors (selectHome, selectLatestNews, selectUpcomingEvents, selectLoading, selectError). */
export const homeFeature = createFeature({
  name: 'home',
  reducer: createReducer(
    initialState,
    on(HomeActions.loadHome, (state): HomeState => ({ ...state, loading: true, error: null })),
    on(
      HomeActions.loadHomeSuccess,
      (state, { home, latestNews, upcomingEvents }): HomeState => ({
        ...state,
        home,
        latestNews,
        upcomingEvents,
        loading: false,
      }),
    ),
    on(HomeActions.loadHomeFailure, (state, { error }): HomeState => ({ ...state, error, loading: false })),
  ),
});
