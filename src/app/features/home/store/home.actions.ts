import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { EventItemContent, HomeContent, NewsItemContent } from '../../../core/models/umbraco.models';

export const HomeActions = createActionGroup({
  source: 'Home',
  events: {
    'Load Home': emptyProps(),
    'Load Home Success': props<{
      home: HomeContent;
      latestNews: NewsItemContent[];
      upcomingEvents: EventItemContent[];
    }>(),
    'Load Home Failure': props<{ error: string }>(),
  },
});
