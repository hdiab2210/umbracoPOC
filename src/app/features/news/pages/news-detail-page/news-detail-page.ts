import { Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalDatePipe } from '../../../../core/pipes/local-date.pipe';
import { languageFeature } from '../../../../core/state/language/language.feature';
import { NewsActions } from '../../store/news.actions';
import { newsFeature } from '../../store/news.feature';

@Component({
  selector: 'app-news-detail-page',
  imports: [RouterLink, TranslatePipe, LocalDatePipe],
  templateUrl: './news-detail-page.html',
})
export class NewsDetailPage {
  private readonly store = inject(Store);

  /** Bound from the ":id" route parameter (withComponentInputBinding). */
  readonly id = input.required<string>();
  protected readonly language = this.store.selectSignal(languageFeature.selectCurrent);

  protected readonly item = this.store.selectSignal(newsFeature.selectSelectedItem);
  protected readonly loading = this.store.selectSignal(newsFeature.selectLoading);
  protected readonly error = this.store.selectSignal(newsFeature.selectError);

  constructor() {
    // Re-runs when the id changes (another article) or the language changes.
    // Both signals must be read INSIDE the effect for it to track them.
    effect(() => {
      this.language();
      this.store.dispatch(NewsActions.loadNewsItem({ id: this.id() }));
    });
  }
}
