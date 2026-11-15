/** The languages the app supports (short codes used inside Angular). */
export type Language = 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  label: string;          // appear on the switcher button
  umbracoCulture: string; // EXACT culture code from Umbraco → Settings → Languages
  dir: 'ltr' | 'rtl';     // text direction  
}

export const LANGUAGES: Record<Language, LanguageOption> = {
  en: { code: 'en', label: 'English', umbracoCulture: 'en-US', dir: 'ltr' },
  ar: { code: 'ar', label: 'العربية', umbracoCulture: 'ar', dir: 'rtl' },
};

export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGE_STORAGE_KEY = 'language';