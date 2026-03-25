# @aum/theme — AUM Core Theme & Styling

Material Design 3 theme, global SCSS abstracts, and the `rem()` scaling function. This library is the styling foundation for all AUM Core components and consuming applications.

## What's inside

```
theme/src/lib/styles/
├── abstracts/
│   ├── _variables.scss   # Breakpoint values ($breakpoint-mobile: 600px, $breakpoint-tablet: 960px)
│   ├── _mixins.scss      # Responsive mixins: @include mobile / tablet / desktop
│   └── functions.scss    # rem() scaling function
├── themes/
│   └── theme-purple/     # Material Design 3 theme (primary: #6E57E0)
└── core.scss             # Main entry — import this in your app's styles.scss
```

## Setup in a consuming app

### 1. Import the theme in `styles.scss`

```scss
@forward 'libs/aum-core/theme/src/lib/styles/core.scss';
```

### 2. Enable SCSS abstracts globally in `project.json`

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["libs/aum-core/theme/src/lib/styles/abstracts/"]
  }
}
```

This makes `rem()` and the breakpoint mixins available in every component SCSS file without an explicit import.

## The `rem()` function

Converts pixel values to `rem` for UI scaling support (Compact / Default / Large modes).

```scss
@use 'functions' as *;   // only needed if not configured via includePaths

.component {
  padding: rem(16);       // scalable — adapts to the user's display mode
  font-size: rem(14);
  border-radius: rem(8);
}
```

**Never use `px` values.** The root font-size shifts per display mode — `rem()` ensures all dimensions scale automatically.

## Responsive mixins

```scss
// No import needed — available globally via includePaths

.component {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}
```

| Mixin | Breakpoint | Use for |
|-------|-----------|---------|
| `@include mobile` | max-width: 600px | Small phone styles |
| `@include tablet` | max-width: 960px | Tablet + phone (most common) |
| `@include desktop` | min-width: 961px | Desktop-only overrides |

See [docs/RESPONSIVE-DESIGN.md](../../../../docs/RESPONSIVE-DESIGN.md) for the full guide.

## Material Design 3 system variables

All colors must come from CSS custom properties — never hardcode hex or rgb values.

```scss
// Correct
.component {
  color: var(--mat-sys-on-surface);
  background: var(--mat-sys-surface);
  border-color: var(--mat-sys-outline-variant);
}

// Wrong — breaks dark mode and theming
.component {
  color: #333;
  background: #fff;
}
```

Key variables:

| Variable | Purpose |
|----------|---------|
| `--mat-sys-primary` | Brand primary color |
| `--mat-sys-on-primary` | Text/icon on primary background |
| `--mat-sys-surface` | Page/card background |
| `--mat-sys-on-surface` | Body text |
| `--mat-sys-surface-container` | Elevated surface (sidebar, toolbar) |
| `--mat-sys-outline` | Borders |
| `--mat-sys-outline-variant` | Subtle dividers |
| `--mat-sys-error` | Error states |

## Generating a custom theme

```bash
npx nx g @angular/material:theme-color --project=aum-core
```

Use the [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) to generate palette values.

## Running tests

```bash
nx test aum-core-theme
```
