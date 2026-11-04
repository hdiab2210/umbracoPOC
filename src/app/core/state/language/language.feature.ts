import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY, Language } from '../../constants/languages';
import { LanguageActions } from './language.actions';

export interface LanguageState {
  current: Language;
}

/** Start with the language the user chose last time, if any. */
function savedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved && saved in LANGUAGES ? (saved as Language) : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE; // localStorage can be blocked (private mode)
  }
}

const initialState: LanguageState = {
  current: savedLanguage(),
};

export const languageFeature = createFeature({
  name: 'language',
  reducer: createReducer(
    initialState,
    on(LanguageActions.setLanguage, (state, { language }): LanguageState => ({ ...state, current: language })),
  ),
  extraSelectors: ({ selectCurrent }) => ({
    /** The full option (label, Umbraco culture, direction) for the current language. */
    selectCurrentOption: createSelector(selectCurrent, (current) => LANGUAGES[current]),
  }),
});