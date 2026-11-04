import { HttpErrorResponse } from '@angular/common/http';

export function toErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return error.status === 404 ? 'Content not found.' : `Request failed (${error.status}).`;
  }
  return 'Something went wrong.';
}

export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
    return error.error.message;
  }
  return toErrorMessage(error);
}

/** Plain-text preview of rich text: strips the HTML tags and cuts at a word boundary. */
export function toExcerpt(markup: string | undefined, maxLength = 140): string {
  const text = (markup ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}


