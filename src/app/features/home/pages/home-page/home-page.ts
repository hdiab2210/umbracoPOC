import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { languageFeature } from '../../../../core/state/language/language.feature';
import { CardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton';
import { EventCard } from '../../../../shared/components/event-card/event-card';
import { NewsCard } from '../../../../shared/components/news-card/news-card';
import { HomeActions } from '../../store/home.actions';
import { homeFeature } from '../../store/home.feature';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TranslatePipe, NewsCard, EventCard, CardSkeleton],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly store = inject(Store);
  private readonly language = this.store.selectSignal(languageFeature.selectCurrent);

  protected readonly home = this.store.selectSignal(homeFeature.selectHome);
  protected readonly latestNews = this.store.selectSignal(homeFeature.selectLatestNews);
  protected readonly upcomingEvents = this.store.selectSignal(homeFeature.selectUpcomingEvents);
  protected readonly loading = this.store.selectSignal(homeFeature.selectLoading);
  protected readonly error = this.store.selectSignal(homeFeature.selectError);

  constructor() {
    effect(() => {
      this.language();
      this.store.dispatch(HomeActions.loadHome());
    });
  }
}
