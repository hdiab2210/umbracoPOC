import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalDatePipe } from '../../../../core/pipes/local-date.pipe';
import { languageFeature } from '../../../../core/state/language/language.feature';
import { isSameDay, isUpcoming } from '../../../../core/utils/event.utils';
import { EventsActions } from '../../store/events.actions';
import { eventsFeature } from '../../store/events.feature';

@Component({
  selector: 'app-event-detail-page',
  imports: [RouterLink, TranslatePipe, LocalDatePipe],
  templateUrl: './event-detail-page.html',
})
export class EventDetailPage {
  private readonly store = inject(Store);

  /** Bound from the ":id" route parameter (withComponentInputBinding). */
  readonly id = input.required<string>();
  protected readonly language = this.store.selectSignal(languageFeature.selectCurrent);

  protected readonly item = this.store.selectSignal(eventsFeature.selectSelectedItem);
  protected readonly loading = this.store.selectSignal(eventsFeature.selectLoading);
  protected readonly error = this.store.selectSignal(eventsFeature.selectError);

  protected readonly isPast = computed(() => {
    const item = this.item();
    return item ? !isUpcoming(item) : false;
  });
  protected readonly sameDay = computed(() =>
    isSameDay(this.item()?.properties.startDate, this.item()?.properties.endDate),
  );

  constructor() {
    // Re-runs when the id changes (another event) or the language changes.
    effect(() => {
      this.language();
      this.store.dispatch(EventsActions.loadEvent({ id: this.id() }));
    });
  }
}
