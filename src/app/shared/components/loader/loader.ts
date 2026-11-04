import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LoaderService } from '../../../core/services/loader.service';

/** Wait this long before showing the bar, so fast requests don't make it flicker. */
const SHOW_DELAY_MS = 150;

/** Thin animated progress bar at the top of the page, visible while any API call runs. */
@Component({
  selector: 'app-loader',
  imports: [TranslatePipe],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader implements OnDestroy {
  private readonly loader = inject(LoaderService);
  private timer?: ReturnType<typeof setTimeout>;

  protected readonly visible = signal(false);

  constructor() {
    // React every time isLoading changes.
    effect(() => {
      clearTimeout(this.timer);
      if (this.loader.isLoading()) {
        this.timer = setTimeout(() => this.visible.set(true), SHOW_DELAY_MS);
      } else {
        this.visible.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
