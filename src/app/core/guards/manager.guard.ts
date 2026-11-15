import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';

import { authFeature } from '../state/auth/auth.feature';

/**
 * Only Content Editors / Content Admins may open /manage. Everyone else goes to the home page.
 */
export const managerGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectInitialized).pipe(
    filter((initialized) => initialized), // 1. after a page refresh, wait until /me has answered
    take(1),
    switchMap(() => store.select(authFeature.selectCanManage).pipe(take(1))), // 2. editor or admin?
    map((canManage) => (canManage ? true : router.createUrlTree(['/']))), // 3. allow, or go home
  );
};
