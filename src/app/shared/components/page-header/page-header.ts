import { Component, input } from '@angular/core';

/** The coloured band at the top of list pages: eyebrow label, title and optional intro text. */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div class="container">
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h1>{{ title() }}</h1>
        @if (intro()) {
          <p class="page-header__intro">{{ intro() }}</p>
        }
        <ng-content />
      </div>
    </header>
  `,
})
export class PageHeader {
  readonly title = input<string | undefined>('');
  readonly eyebrow = input<string>();
  readonly intro = input<string>();
}
