import { createFeature, createReducer, on } from '@ngrx/store';

import { NewsItemContent, NewsPageContent } from '../../../core/models/umbraco.models';
import { NewsActions } from './news.actions';

export interface NewsState {
  page: NewsPageContent | null;
  items: NewsItemContent[];
  selectedItem: NewsItemContent | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  page: null,
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

/** Reducer + auto-generated selectors (selectItems, selectSelectedItem, selectLoading, selectError). */
export const newsFeature = createFeature({
  name: 'news',
  reducer: createReducer(
    initialState,
    on(NewsActions.loadNews, (state): NewsState => ({ ...state, loading: true, error: null })),
    on(NewsActions.loadNewsSuccess, (state, { page, items }): NewsState => ({ ...state, page, items, loading: false })),
    on(NewsActions.loadNewsFailure, (state, { error }): NewsState => ({ ...state, error, loading: false })),

    on(NewsActions.loadNewsItem, (state): NewsState => ({ ...state, selectedItem: null, loading: true, error: null })),
    on(NewsActions.loadNewsItemSuccess, (state, { item }): NewsState => ({ ...state, selectedItem: item, loading: false })),
    on(NewsActions.loadNewsItemFailure, (state, { error }): NewsState => ({ ...state, error, loading: false })),
  ),
});
