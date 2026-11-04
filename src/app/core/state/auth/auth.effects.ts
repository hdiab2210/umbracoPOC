import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { toAuthErrorMessage } from '../../utils/content.utils';
import { AuthActions } from './auth.actions';

/** When the app starts, ask Umbraco if the cookie still belongs to a logged-in member. */
export const initAuth = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(ofType(ROOT_EFFECTS_INIT), map(() => AuthActions.loadCurrentMember())),
  { functional: true },
);

export const loadCurrentMember = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(AuthActions.loadCurrentMember),
      switchMap(() =>
        api.getCurrentMember().pipe(
          map((member) => AuthActions.currentMemberLoaded({ member })),
          catchError(() => of(AuthActions.currentMemberLoaded({ member: null }))),
        ),
      ),
    ),
  { functional: true },
);

export const register = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ request }) =>
        api.register(request).pipe(
          map((member) => AuthActions.registerSuccess({ member })),
          catchError((error) => of(AuthActions.registerFailure({ error: toAuthErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);

export const login = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ request }) =>
        api.login(request).pipe(
          map((member) => AuthActions.loginSuccess({ member })),
          catchError((error) => of(AuthActions.loginFailure({ error: toAuthErrorMessage(error) }))),
        ),
      ),
    ),
  { functional: true },
);

export const logout = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        api.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())), // forget the member locally either way
        ),
      ),
    ),
  { functional: true },
);

/** After signup, login or logout, go to the home page. */
export const redirectAfterAuth = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.registerSuccess, AuthActions.loginSuccess, AuthActions.logoutSuccess),
      tap(() => router.navigateByUrl('/')),
    ),
  { functional: true, dispatch: false },
);