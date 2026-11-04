import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '../services/loader.service';

/**
 * Lets a single request opt out of the global loader:
 *   http.get(url, { context: new HttpContext().set(SKIP_LOADER, true) })
 */
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

/** Shows the global loader while any API request is in progress. */
export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  // Translation files (/i18n/*.json) are not API calls: no loader for them.
  if (req.context.get(SKIP_LOADER) || req.url.startsWith('/i18n/')) {
    return next(req);
  }

  const loader = inject(LoaderService);
  loader.show();

  // finalize runs on success, on error AND when the request is cancelled
  // (e.g. switchMap dropping it), so the counter can never get stuck.
  return next(req).pipe(finalize(() => loader.hide()));
};
