import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { EventItemContent } from '../../../core/models/umbraco.models';
import { LocalDatePipe } from '../../../core/pipes/local-date.pipe';
import { languageFeature } from '../../../core/state/language/language.feature';
import { toExcerpt } from '../../../core/utils/content.utils';
import { isSameDay, isUpcoming } from '../../../core/utils/event.utils';

/** One event as a card with a calendar badge (used on Home and the Events list). */
@Component({
  selector: 'app-event-card',
  imports: [RouterLink, TranslatePipe, LocalDatePipe],
  templateUrl: './event-card.html',
})
export class EventCard {
  readonly item = input.required<EventItemContent>();

  protected readonly language = inject(Store).selectSignal(languageFeature.selectCurrent);
  protected readonly props = computed(() => this.item().properties);
  protected readonly image = computed(() => this.props().image?.[0]);
  protected readonly excerpt = computed(() => toExcerpt(this.props().description?.markup, 110));
  protected readonly isPast = computed(() => !isUpcoming(this.item()));
  protected readonly sameDay = computed(() => isSameDay(this.props().startDate, this.props().endDate));
}
