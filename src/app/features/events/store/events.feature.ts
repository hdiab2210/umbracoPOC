import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { EventItemContent, EventsPageContent } from '../../../core/models/umbraco.models';
import { isUpcoming } from '../../../core/utils/event.utils';
import { EventsActions } from './events.actions';

export interface EventsState {
  page: EventsPageContent | null;
  items: EventItemContent[];
  selectedItem: EventItemContent | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  page: null,
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

/**
 * Reducer + auto-generated selectors (selectPage, selectItems, selectSelectedItem, selectLoading, selectError)
 * + two derived selectors that split the list into upcoming and past events.
 */
export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,
    on(EventsActions.loadEvents, (state): EventsState => ({ ...state, loading: true, error: null })),
    on(EventsActions.loadEventsSuccess, (state, { page, items }): EventsState => ({ ...state, page, items, loading: false })),
    on(EventsActions.loadEventsFailure, (state, { error }): EventsState => ({ ...state, error, loading: false })),

    on(EventsActions.loadEvent, (state): EventsState => ({ ...state, selectedItem: null, loading: true, error: null })),
    on(EventsActions.loadEventSuccess, (state, { item }): EventsState => ({ ...state, selectedItem: item, loading: false })),
    on(EventsActions.loadEventFailure, (state, { error }): EventsState => ({ ...state, error, loading: false })),
  ),
  extraSelectors: ({ selectItems }) => ({
    selectUpcoming: createSelector(selectItems, (items) => items.filter((e) => isUpcoming(e))),
    // Most recent past event first.
    selectPast: createSelector(selectItems, (items) => items.filter((e) => !isUpcoming(e)).reverse()),
  }),
});
