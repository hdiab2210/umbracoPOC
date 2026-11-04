import { Component, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { languageFeature } from '../../../../core/state/language/language.feature';
import { CardSkeleton } from '../../../../shared/components/card-skeleton/card-skeleton';
import { EventCard } from '../../../../shared/components/event-card/event-card';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EventsActions } from '../../store/events.actions';
import { eventsFeature } from '../../store/events.feature';

type Tab = 'upcoming' | 'past';

@Component({
  selector: 'app-events-list-page',
  imports: [TranslatePipe, PageHeader, EventCard, CardSkeleton],
  templateUrl: './events-list-page.html',
})
export class EventsListPage {
  private readonly store = inject(Store);
  private readonly language = this.store.selectSignal(languageFeature.selectCurrent);

  protected readonly page = this.store.selectSignal(eventsFeature.selectPage);
  protected readonly upcoming = this.store.selectSignal(eventsFeature.selectUpcoming);
  protected readonly past = this.store.selectSignal(eventsFeature.selectPast);
  protected readonly loading = this.store.selectSignal(eventsFeature.selectLoading);
  protected readonly error = this.store.selectSignal(eventsFeature.selectError);

  /** Local UI state (which tab is open) stays in the component; it isn't shared app state. */
  protected readonly tab = signal<Tab>('upcoming');

  constructor() {
    // Runs now, and again every time the language changes.
    effect(() => {
      this.language();
      this.store.dispatch(EventsActions.loadEvents());
    });
  }
}
