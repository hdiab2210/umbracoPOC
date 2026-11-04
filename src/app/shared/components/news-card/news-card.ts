import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { NewsItemContent } from '../../../core/models/umbraco.models';
import { LocalDatePipe } from '../../../core/pipes/local-date.pipe';
import { languageFeature } from '../../../core/state/language/language.feature';
import { toExcerpt } from '../../../core/utils/content.utils';

/** One news article as a card (used on Home and the News list). */
@Component({
  selector: 'app-news-card',
  imports: [RouterLink, TranslatePipe, LocalDatePipe],
  templateUrl: './news-card.html',
})
export class NewsCard {
  readonly item = input.required<NewsItemContent>();

  protected readonly language = inject(Store).selectSignal(languageFeature.selectCurrent);
  protected readonly image = computed(() => this.item().properties.image?.[0]);
  protected readonly excerpt = computed(() => toExcerpt(this.item().properties.description?.markup));
}
