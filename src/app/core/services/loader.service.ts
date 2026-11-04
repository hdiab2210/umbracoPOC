import { computed, Injectable, signal } from '@angular/core';

/**
 * Counts the HTTP requests that are in progress.
 * A counter (not a true/false flag) so that when 3 requests run together,
 * the loader only hides after the LAST one finishes.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly activeRequests = signal(0);

  /** true while at least one request is running. */
  readonly isLoading = computed(() => this.activeRequests() > 0);

  show(): void {
    this.activeRequests.update((count) => count + 1);
  }

  hide(): void {
    // Never go below 0, even if hide() is called one time too many.
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
