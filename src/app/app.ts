import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { Language, LANGUAGES } from './core/constants/languages';
import { AuthActions } from './core/state/auth/auth.actions';
import { authFeature } from './core/state/auth/auth.feature';
import { LanguageActions } from './core/state/language/language.actions';
import { languageFeature } from './core/state/language/language.feature';
import { Loader } from './shared/components/loader/loader';

/** App shell: header, the routed feature page, and the footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(Store);

  protected readonly languages = Object.values(LANGUAGES);
  protected readonly currentLanguage = this.store.selectSignal(languageFeature.selectCurrent);
  protected readonly member = this.store.selectSignal(authFeature.selectMember);

  /** Mobile menu open/closed: purely local UI state, so a signal (not the store) is enough. */
  protected readonly menuOpen = signal(false);
  protected readonly year = new Date().getFullYear();

  protected logout(): void {
    this.menuOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }

  protected setLanguage(language: Language): void {
    this.store.dispatch(LanguageActions.setLanguage({ language }));
  }
}
