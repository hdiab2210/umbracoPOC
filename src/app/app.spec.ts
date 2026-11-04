import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';

import { App } from './app';
import { authFeature } from './core/state/auth/auth.feature';
import { languageFeature } from './core/state/language/language.feature';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideStore(),
        provideState(languageFeature),
        provideState(authFeature),
        // No loader: the pipe shows the translation keys, which is fine for a test.
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navigation links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.site-nav a'));
    expect(links.map((a) => a.textContent?.trim())).toEqual(['nav.home', 'nav.news', 'nav.events']);
  });
});
