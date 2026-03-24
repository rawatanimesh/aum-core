import { Injectable, signal } from '@angular/core';

export type Viewport = 'mobile' | 'tablet' | 'desktop';

/**
 * Breakpoint values — must stay in sync with
 * $breakpoint-mobile and $breakpoint-tablet in _variables.scss
 */
const BREAKPOINTS = {
  mobile: '(max-width: 600px)',
  tablet: '(max-width: 960px)',
} as const;

/**
 * Service to reactively track the current viewport breakpoint.
 *
 * Use this for TypeScript-side logic only (conditional rendering,
 * data fetching strategy, component variants, etc.).
 * For CSS-only responsive styling, use the SCSS breakpoint mixins instead.
 *
 * @example
 * export class MyComponent {
 *   private viewport = inject(ViewportService);
 *   isMobile = computed(() => this.viewport.current() === 'mobile');
 * }
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly mobileQuery = window.matchMedia(BREAKPOINTS.mobile);
  private readonly tabletQuery = window.matchMedia(BREAKPOINTS.tablet);

  private readonly _current = signal<Viewport>(this.detect());
  readonly current = this._current.asReadonly();

  constructor() {
    this.mobileQuery.addEventListener('change', () => this._current.set(this.detect()));
    this.tabletQuery.addEventListener('change', () => this._current.set(this.detect()));
  }

  private detect(): Viewport {
    if (this.mobileQuery.matches) return 'mobile';
    if (this.tabletQuery.matches) return 'tablet';
    return 'desktop';
  }
}
