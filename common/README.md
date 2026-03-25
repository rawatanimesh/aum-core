# @aum/common — AUM Core Common Components & Assets

Shared components (Login, PageNotFound), translation files, and SVG assets used across all AUM applications.

## Import path

```typescript
import { LoginComponent }        from '@aum/common';
import { PageNotFoundComponent } from '@aum/common';
```

## Components

### `LoginComponent`

Ready-to-use login page. Wire it to your `/login` route:

```typescript
// app.routes.ts
{ path: 'login', loadComponent: () => import('@aum/common').then(m => m.LoginComponent) }
```

### `PageNotFoundComponent`

Standard 404 page. Use as the wildcard route inside your template's children:

```typescript
{ path: '**', loadComponent: () => import('@aum/common').then(m => m.PageNotFoundComponent) }
```

## Assets

Assets live in `src/assets/` and must be referenced in your app's `project.json` asset globs to be available at runtime.

### Translation files (`src/assets/i18n/`)

| File | Language |
|------|----------|
| `en.json` | English (default) |
| `ja.json` | Japanese |
| `hi.json` | Hindi |

Add to `project.json`:

```json
{
  "glob": "**/*.json",
  "input": "libs/aum-core/common/src/assets/i18n",
  "output": "assets/i18n"
}
```

All translation keys follow `UPPER_SNAKE_CASE`. Add app-specific keys to your own `src/assets/i18n/` files — they merge with the shared keys at runtime.

### SVGs (`src/assets/resources/svgs/`)

```
svgs/
├── snackbar/         # success.svg, error.svg, warning.svg, info.svg
└── confirmation/     # page-not-found.svg, alert.svg, check.svg, error-page.svg, ...
```

Add to `project.json`:

```json
{
  "glob": "**/*.svg",
  "input": "libs/aum-core/common/src/assets/resources/svgs",
  "output": "assets/svgs"
}
```

## Running tests

```bash
nx test aum-core-common
```
