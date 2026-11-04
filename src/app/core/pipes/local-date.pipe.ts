import { Pipe, PipeTransform } from '@angular/core';

import { LANGUAGES, Language } from '../constants/languages';

/** Named formats so templates stay short: {{ date | localDate: lang : 'long' }} */
const FORMATS = {
  /** 18 Nov 2026 */
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  /** Wednesday, 18 November 2026 */
  long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  /** 09:00 */
  time: { hour: '2-digit', minute: '2-digit' },
  /** "18" (for the calendar badge) */
  day: { day: 'numeric' },
  /** "Nov" (for the calendar badge) */
  month: { month: 'short' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type LocalDateFormat = keyof typeof FORMATS;

/**
 * Formats a date in the current UI language using the browser's Intl API,
 * so Arabic gets Arabic month names without registering Angular locale data.
 * The language is passed in (instead of injected) so the pipe stays pure and
 * re-runs automatically when the language signal changes.
 */
@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
  transform(value: string | null | undefined, language: Language, format: LocalDateFormat = 'medium'): string {
    if (!value) return '';
    const locale = language === 'ar' ? 'ar-EG' : LANGUAGES[language].umbracoCulture;
    return new Intl.DateTimeFormat(locale, FORMATS[format]).format(new Date(value));
  }
}
