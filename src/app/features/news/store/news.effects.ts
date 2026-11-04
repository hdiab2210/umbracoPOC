import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { toErrorMessage } from '../../../core/utils/content.utils';
import { NewsActions } from './news.actions';

export const loadNews = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(NewsActions.loadNews),
      switchMap(() =>
        forkJoin({ page: api.getNewsPage(), items: api.getNewsItems() }).pipe(
          map(({ page, items }) => NewsActions.loadNewsSuccess({ page, items })),
          catchError((error) => of(NewsActions.loadNewsFailure({ error: toErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadNewsItem = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(NewsActions.loadNewsItem),
      switchMap(({ id }) =>
        api.getNewsItem(id).pipe(
          map((item) => NewsActions.loadNewsItemSuccess({ item })),
          catchError((error) => of(NewsActions.loadNewsItemFailure({ error: toErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);
