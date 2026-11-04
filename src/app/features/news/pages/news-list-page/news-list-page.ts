import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { languageFeature } from '../../../../core/state/language/language.feature';
import { CardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton';
import { NewsCard } from '../../../../shared/components/news-card/news-card';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NewsActions } from '../../store/news.actions';
import { newsFeature } from '../../store/news.feature';

@Component({
  selector: 'app-news-list-page',
  imports: [TranslatePipe, PageHeader, NewsCard, CardSkeleton],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private readonly store = inject(Store);
  private readonly language = this.store.selectSignal(languageFeature.selectCurrent);

  protected readonly page = this.store.selectSignal(newsFeature.selectPage);
  protected readonly items = this.store.selectSignal(newsFeature.selectItems);
  protected readonly loading = this.store.selectSignal(newsFeature.selectLoading);
  protected readonly error = this.store.selectSignal(newsFeature.selectError);

  constructor() {
    // Runs now, and again every time the language changes.
    effect(() => {
      this.language();
      this.store.dispatch(NewsActions.loadNews());
    });
  }
}
