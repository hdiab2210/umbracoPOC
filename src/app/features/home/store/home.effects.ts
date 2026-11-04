import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { toErrorMessage } from '../../../core/utils/content.utils';
import { isUpcoming } from '../../../core/utils/event.utils';
import { HomeActions } from './home.actions';

/** The home page needs three things; forkJoin fetches them in parallel and waits for all of them. */
export const loadHome = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(HomeActions.loadHome),
      switchMap(() =>
        forkJoin({
          home: api.getHome(),
          latestNews: api.getNewsItems(3),
          upcomingEvents: api.getEventItems().pipe(map((events) => events.filter((e) => isUpcoming(e)).slice(0, 3))),
        }).pipe(
          map((result) => HomeActions.loadHomeSuccess(result)),
          catchError((error) => of(HomeActions.loadHomeFailure({ error: toErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);
