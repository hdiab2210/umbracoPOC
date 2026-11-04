import { Component, computed, input } from '@angular/core';

/** Grey placeholder cards shown while content loads (feels faster than a "Loading…" text). */
@Component({
  selector: 'app-card-skeleton',
  template: `
    <div class="card-grid" aria-busy="true">
      @for (i of placeholders(); track i) {
        <div class="card skeleton">
          <div class="card__media"></div>
          <div class="card__body">
            <span class="skeleton__line skeleton__line--short"></span>
            <span class="skeleton__line"></span>
            <span class="skeleton__line"></span>
          </div>
        </div>
      }
    </div>
  `,
})
export class CardSkeleton {
  readonly count = input(3);
  protected readonly placeholders = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
