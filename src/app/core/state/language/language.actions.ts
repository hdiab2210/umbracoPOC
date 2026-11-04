import { createActionGroup, props } from '@ngrx/store';

import { Language } from '../../constants/languages';

export const LanguageActions = createActionGroup({
  source: 'Language',
  events: {
    'Set Language': props<{ language: Language }>(),
  },
});