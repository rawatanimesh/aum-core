# Responsive Design

This document covers the two tools AUM provides for responsive behaviour — SCSS breakpoint mixins for styling and `ViewportService` for TypeScript logic — and explains when to use each.

---

## Breakpoints

All breakpoint values are defined once in `_variables.scss` and shared across both tools.

| Name | Value | Applies to |
|---|---|---|
| `$breakpoint-mobile` | `600px` | screens up to 600px wide |
| `$breakpoint-tablet` | `960px` | screens between 601px and 960px |
| Desktop | above 960px | default (no specific variable needed) |

**File:** [libs/aum-core/theme/src/lib/styles/abstracts/_variables.scss](../libs/aum-core/theme/src/lib/styles/abstracts/_variables.scss)

---

## SCSS Breakpoint Mixins

Use these for all responsive CSS. They consume the breakpoint variables above, so breakpoint values are never repeated in component SCSS files.

**File:** [libs/aum-core/theme/src/lib/styles/abstracts/_mixins.scss](../libs/aum-core/theme/src/lib/styles/abstracts/_mixins.scss)

The mixins are globally available in all component SCSS files via `stylePreprocessorOptions.includePaths`. No import needed.

### Available Mixins

```scss
@include mobile  { ... }  // max-width: 600px
@include tablet  { ... }  // max-width: 960px  (includes mobile widths too)
@include desktop { ... }  // min-width: 961px
```

### Usage

```scss
// No import needed — available globally in all component SCSS files
.my-component {
  padding: rem(32);
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    padding: rem(24);
  }

  @include mobile {
    grid-template-columns: 1fr;
    padding: rem(16);
  }
}
```

### When to use which mixin

- Use `@include mobile` for styles specific to small phones (up to 600px).
- Use `@include tablet` for styles that apply to both tablets and phones (up to 960px). This is the more common one — most layout changes start here.
- Use `@include desktop` when you want to apply styles **only** on large screens, and the default (non-media-query) styles are meant for smaller screens (mobile-first approach).

### Mobile-first vs Desktop-first

The mixins support both approaches. Choose one and be consistent within a component.

```scss
// Desktop-first (default styles for desktop, override down)
.card {
  display: flex;
  flex-direction: row;

  @include tablet {
    flex-direction: column; // override for tablet and below
  }
}

// Mobile-first (default styles for mobile, override up)
.card {
  flex-direction: column;

  @include desktop {
    flex-direction: row; // override for desktop only
  }
}
```

---

## ViewportService

Use this when you need the current viewport **in TypeScript** — for conditional rendering, switching between component variants, or adjusting data fetch behaviour.

**File:** [libs/aum-core/utils/src/lib/services/viewport/viewport.service.ts](../libs/aum-core/utils/src/lib/services/viewport/viewport.service.ts)

### The Signal

```typescript
import { ViewportService } from '@aum-core/utils';

export class MyComponent {
  private viewport = inject(ViewportService);

  // Readonly signal — updates automatically on window resize
  // value is: 'mobile' | 'tablet' | 'desktop'
  readonly currentViewport = this.viewport.current;
}
```

### Common Patterns

**Computed boolean flags** (most common)

```typescript
isMobile = computed(() => this.viewport.current() === 'mobile');
isTablet = computed(() => this.viewport.current() === 'tablet');
isDesktop = computed(() => this.viewport.current() === 'desktop');
```

**Template conditional rendering**

```html
@if (isMobile()) {
  <aum-bottom-sheet-nav />
} @else {
  <aum-sidebar-nav />
}
```

**Adjusting behaviour based on viewport**

```typescript
pageSize = computed(() => this.viewport.current() === 'mobile' ? 10 : 25);
```

**Switching component inputs**

```html
<aum-data-table
  [compact]="isMobile()"
  [pageSize]="pageSize()"
/>
```

### What ViewportService is NOT for

Do not use it to apply CSS. Use the SCSS mixins for that.

```typescript
// Don't do this
class MyComponent {
  isMobile = computed(() => this.viewport.current() === 'mobile');
}
```
```html
<!-- Don't do this -->
<div [class.compact]="isMobile()">...</div>
```
```scss
// Don't do this
.compact { padding: rem(16); }
```

Use SCSS mixins instead — they have zero runtime cost, no change detection involvement, and work before JavaScript initialises.

---

## Decision Guide

| Scenario | Tool |
|---|---|
| Responsive padding, font size, layout | SCSS `@include mobile/tablet/desktop` |
| Show/hide entire sections or components | `ViewportService` + `@if` in template |
| Render different component variants | `ViewportService` + `@if` in template |
| Different page size / data fetch per viewport | `ViewportService` computed signal |
| Any CSS property change at a breakpoint | SCSS mixin — never ViewportService |

---

## Architecture Notes

- Breakpoint values are defined **once** in `_variables.scss` and referenced in both `_mixins.scss` and `ViewportService`. If breakpoints change, update `_variables.scss` and the `BREAKPOINTS` constant in `viewport.service.ts`.
- `ViewportService` uses `window.matchMedia` — the same browser API used by `@media` queries — so both tools always reflect the same breakpoints.
- The service is `providedIn: 'root'`, so it is a singleton. All components share one listener.
- Do not add a `VIEWPORT_CHANGED` global event to `AppEventBusService`. The signal is the reactive primitive — components inject the service directly. The event bus is for discrete user actions (theme change, language change), not continuous environment state.
