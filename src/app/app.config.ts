import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as languageEffects from './core/state/language/language.effect';
import * as authEffects from './core/state/auth/auth.effects';

import { routes } from './app.routes';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { languageFeature } from './core/state/language/language.feature';
import { provideTranslateService } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE } from './core/constants/languages';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { authFeature } from './core/state/auth/auth.feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([languageInterceptor, loaderInterceptor])),

    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
      fallbackLang: DEFAULT_LANGUAGE,
      lang: DEFAULT_LANGUAGE,
    }),


    provideStore(),
    provideState(languageFeature),
    provideState(authFeature),
    provideEffects(languageEffects, authEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
