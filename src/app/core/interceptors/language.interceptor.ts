import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { languageFeature } from '../state/language/language.feature';

/** Asks Umbraco for content in the current language. */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  // Only Umbraco API calls need the header (not /i18n/*.json or images).
  if (!req.url.startsWith('/umbraco/')) {
    return next(req);
  }

  const language = inject(Store).selectSignal(languageFeature.selectCurrentOption)();

  return next(req.clone({ setHeaders: { 'Accept-Language': language.umbracoCulture } }));
};