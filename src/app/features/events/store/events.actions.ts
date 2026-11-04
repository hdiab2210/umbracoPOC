import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { EventItemContent, EventsPageContent } from '../../../core/models/umbraco.models';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    'Load Events': emptyProps(),
    'Load Events Success': props<{ page: EventsPageContent | null; items: EventItemContent[] }>(),
    'Load Events Failure': props<{ error: string }>(),

    'Load Event': props<{ id: string }>(),
    'Load Event Success': props<{ item: EventItemContent }>(),
    'Load Event Failure': props<{ error: string }>(),
  },
});
