import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { NewsItemContent, NewsPageContent } from '../../../core/models/umbraco.models';

export const NewsActions = createActionGroup({
  source: 'News',
  events: {
    'Load News': emptyProps(),
    'Load News Success': props<{ page: NewsPageContent | null; items: NewsItemContent[] }>(),
    'Load News Failure': props<{ error: string }>(),


    'Load News Item': props<{ id: string }>(),
    'Load News Item Success': props<{ item: NewsItemContent }>(),
    'Load News Item Failure': props<{ error: string }>(),
  },
});
