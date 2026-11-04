import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';

import { LANGUAGE_STORAGE_KEY } from '../../constants/languages';
import { languageFeature } from './language.feature';

/** Whenever the language changes (and once at startup), update the page to match. */
export const applyLanguage = createEffect(
  (store = inject(Store), translate = inject(TranslateService), document = inject(DOCUMENT)) =>
    store.select(languageFeature.selectCurrentOption).pipe(
      tap((option) => {
        translate.use(option.code);                     // switch UI labels (loads ar.json / en.json)
        document.documentElement.lang = option.code;    // <html lang="ar">
        document.documentElement.dir = option.dir;      // <html dir="rtl">
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, option.code); // remember the choice
        } catch {}
      }),
    ),
  { functional: true, dispatch: false },
);