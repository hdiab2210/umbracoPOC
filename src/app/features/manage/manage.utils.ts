import { HttpErrorResponse } from '@angular/common/http';

/**
 * Editors type plain text in a textarea; Umbraco stores HTML.
 * "Line 1\n\nLine 2" → "<p>Line 1</p><p>Line 2</p>"   (single line breaks become <br>)
 */
export function textToHtml(text: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .trim()
    .split(/\n\s*\n/) // blank line = new paragraph
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => `<p>${escape(paragraph.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** The opposite, to fill the textarea when editing: "<p>A</p><p>B</p>" → "A\n\nB". */
export function htmlToText(html: string): string {
  if (!html) return '';
  const withBreaks = html
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n');
  // DOMParser turns "&amp;" back into "&" and drops the remaining tags safely (no scripts run).
  return new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent?.trim() ?? '';
}

/** Server date "2026-11-18T09:00:00" → "2026-11-18T09:00" (the format <input type="datetime-local"> needs). */
export function toInputDate(value: string | null | undefined): string {
  return value ? value.slice(0, 16) : '';
}

/** A readable message for a failed manage request. Returns a translation key or the server's own message. */
export function toManageError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 401) return 'manage.errors.notLoggedIn';
    if (error.status === 403) return 'manage.errors.forbidden';
    if (error.status === 404) return 'manage.errors.notFound';
    if (error.status === 409 && error.error?.code === 'pastEvent') return 'manage.errors.pastEvent';
    if (error.status === 400 && error.error?.code === 'ownRole') return 'manage.errors.ownRole';
    if (typeof error.error?.message === 'string') return error.error.message;
  }
  return 'manage.errors.generic';
}
