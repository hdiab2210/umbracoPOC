import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { toErrorMessage } from '../../../core/utils/content.utils';
import { EventsActions } from './events.actions';

/** Events list page: the "Events" page (for its title) + all event items, in parallel. */
export const loadEvents = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(EventsActions.loadEvents),
      switchMap(() =>
        forkJoin({ page: api.getEventsPage(), items: api.getEventItems() }).pipe(
          map(({ page, items }) => EventsActions.loadEventsSuccess({ page, items })),
          catchError((error) => of(EventsActions.loadEventsFailure({ error: toErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadEvent = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(EventsActions.loadEvent),
      switchMap(({ id }) =>
        api.getEventItem(id).pipe(
          map((item) => EventsActions.loadEventSuccess({ item })),
          catchError((error) => of(EventsActions.loadEventFailure({ error: toErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);
