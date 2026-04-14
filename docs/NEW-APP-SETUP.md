# AUM Workspace - New App Setup Guide

Reference document for scaffolding a new application inside this NX monorepo. Covers every decision point with structural patterns and code templates.

**IMPORTANT:** All generated code MUST follow [BEST_PRACTICES.md](../BEST_PRACTICES.md), especially:
- **CRITICAL:** Use Material Design system variables for colors (no hardcoded colors)
- **CRITICAL:** Use `rem()` function for all dimensions (no px values)
- Import `@use 'functions' as *;` in all component SCSS files
- Ensure light/dark mode compatibility
- Support all UI scale modes (Compact/Default/Large)

---

## Quick Reference

| Item | Pattern |
|------|---------|
| **Workspace** | NX 22.x + Angular 21.x |
| **App location** | `apps/{app-name}/` |
| **Feature modules** | `libs/modules/{scope}/{feature}/` |
| **Core libraries** | `@aum/*` (ui, theme, utils, common, templates) |
| **Template 1** | `@aum/templates/aum-template` — toolbar-first layout; recommended for enterprise/scalable apps |
| **Template 2** | `@aum/templates/aum-template-2` — sidebar-first, responsive; suited for simpler or standalone apps |

---

## Step 1 — Basic Info

Decide on these four values before writing any code:

| Field | Format | Example | Used for |
|-------|--------|---------|----------|
| **App folder name** | kebab-case | `my-app` | `apps/{name}/`, project.json |
| **Import scope** | `@prefix` | `@my-app` | TypeScript paths `@my-app/*` |
| **Component prefix** | short word | `ma` | HTML tags `<ma-root>`, `<ma-dashboard>` |
| **Display name** | Human-readable | "My App" | app-config.json, page title |

---

## Step 2 — Choose a Template

### AumTemplate (`@aum/templates/aum-template`)

- **Layout:** Top toolbar always visible; sidenav slides in as an overlay when toggled.
- **Toolbar:** Supports dynamic global actions ([DYNAMIC-TOOLBAR-ACTIONS.md](./DYNAMIC-TOOLBAR-ACTIONS.md)) and custom toolbar templates ([CUSTOM-TOOLBAR-TEMPLATES.md](./CUSTOM-TOOLBAR-TEMPLATES.md)).
- **Mobile:** A settings drawer slides in from the right, exposing preferences, profile, and any `overflow: true` toolbar actions.
- **Use when:** The app primarily needs a persistent header with a hamburger-triggered nav.

```typescript
// app.routes.ts
import { AumTemplate } from '@aum/templates/aum-template';

{ path: '', component: AumTemplate, children: [...] }
```

### AumTemplate2 (`@aum/templates/aum-template-2`)

- **Layout:** Persistent sidebar on desktop/tablet; collapses to a slide-out drawer on mobile (≤700px).
- **Mobile header:** Minimal bar with brand logo + hamburger. No separate toolbar component.
- **Branding:** Sidebar renders `brandLogo`, `appLogo`, and `appName` from `app-config.json`.
- **Input:** `drawerWidth` — CSS width for the mobile drawer (default `'200px'`).
- **Use when:** The app is relatively simple or standalone and benefits from always-visible navigation on larger screens.

```typescript
// app.routes.ts
import { AumTemplate2 } from '@aum/templates/aum-template-2';

{ path: '', component: AumTemplate2, data: { drawerWidth: '240px' }, children: [...] }
```

---

## Step 3 — Authentication (optional)

If the app requires authentication, add a route guard and HTTP interceptor.

```
app.config.ts
  ├─ provideHttpClient(withInterceptors([authInterceptor]))
  └─ { provide: AUTH_CONFIG, useValue: { ... } }

app.routes.ts
  ├─ Protected routes: canActivate: [AuthGuardService]
  └─ Public routes: /login (uses LoginComponent from @aum/common)
```

The demo app ships with a simple `AuthGuardService` — copy and adapt it.

---

## Step 4 — Environment Config

Create environment files under `src/app/environments/`:

```
src/app/environments/
├─ environment.interface.ts
├─ environment.ts          (development)
└─ environment.prod.ts     (production)
```

**Minimum variables:**

```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
  name: string;
}

// environment.ts
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  name: 'development',
};
```

---

## Step 5 — Routing

```typescript
// app.routes.ts
import { Route } from '@angular/router';
import { AumTemplate2 } from '@aum/templates/aum-template-2';
import { PageNotFoundComponent } from '@aum/common';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('@aum/common').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AumTemplate2,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@{scope}/dashboard').then(m => m.DashboardComponent),
      },
      // more routes...
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];
```

---

## Step 6 — App Config (`app-config.json`)

`AppConfigService` reads this file at startup (via the `APP_CONFIG` injection token). Place it at `src/app/app-config.json`.

```json
{
  "brandLogo": "assets/svgs/brand-logo.svg",
  "appLogo": "assets/svgs/app-logo.svg",
  "appName": "My App",
  "navItems": [
    { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard", "selected": true },
    {
      "label": "REPORTS",
      "value": "reports",
      "icon": "assessment",
      "expanded": false,
      "children": [
        { "label": "SALES", "value": "/reports/sales", "icon": "trending_up" }
      ]
    }
  ],
  "toolbarMenus": {
    "preferences": {
      "show": true,
      "disabled": false,
      "items": {
        "language": { "show": true,  "disabled": false },
        "theme":    { "show": true,  "disabled": false },
        "palette":  { "show": true,  "disabled": false },
        "template": { "show": false, "disabled": false }
      }
    },
    "profile": {
      "show": true,
      "disabled": false,
      "items": {
        "profile":  { "show": true, "disabled": true },
        "settings": { "show": true, "disabled": true },
        "logout":   { "show": true, "disabled": false }
      }
    }
  },
  "defaults": {
    "template": "template-2",
    "theme": "light",
    "palette": "sea-green",
    "displayMode": "default",
    "language": "en"
  },
  "disableRipple": false
}
```

**Notes:**
- `toolbarMenus` controls the preferences and profile menus. In `AumTemplate` these appear in the top toolbar; in `AumTemplate2` they appear inside the sidebar.
- `toolbarMenus.preferences.items.template` controls whether a **Template switcher** option appears in the preferences menu. Set `"show": true` only in apps that expose runtime template switching (e.g. the demo app). Most apps should keep this `false` and hardcode their template choice in routes.
- `toolbarMenus.preferences.items.palette` controls whether the **Color Palette** option appears. Set `"show": false` to hide it and lock the palette to the `defaults.palette` value.
- `defaults` sets the initial preference values for a **fresh session** (no localStorage). Once the user changes any preference, their choice is saved to localStorage and the config default no longer applies for that preference. Supported palette values: `"purple"`, `"ocean-blue"`, `"sea-green"`.

---

## Step 7 — Internationalization (i18n)

All user-facing text must use translation keys. AUM uses a **two-source namespace architecture** — core library keys and app keys live in separate files and are merged at runtime with zero collision risk.

### Create app translation files

Create one file per supported language in `apps/{app}/src/assets/i18n/`:

```
apps/{app}/src/assets/i18n/
├── en.json   ← app-specific English keys
├── ja.json   ← app-specific Japanese keys (if supporting ja)
└── hi.json   ← app-specific Hindi keys (if supporting hi)
```

```json
// apps/{app}/src/assets/i18n/en.json — flat root-level keys, no AUM.* namespace
{
  "DASHBOARD": "Dashboard",
  "WELCOME_MESSAGE": "Welcome to My App"
}
```

The core library files (`aum.en.json`, `aum.ja.json`, `aum.hi.json`) are pulled in automatically via the asset glob in `project.json` — no manual copying needed.

### Wire up the multi-loader

```typescript
// app.config.ts
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from '@aum/utils/services';

// Merges core library translations (AUM.*) with app-level translations at runtime.
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' }, // core: AUM.* keys
    { prefix: './assets/i18n/', suffix: '.json' },      // app: flat keys
  ]);
}
```

**Provider order — CRITICAL:** `provideHttpClient()` must appear before `TranslateModule.forRoot()`. Reversing this causes translations to fail silently.

```typescript
providers: [
  // 1. HttpClient first
  provideHttpClient(withInterceptors([...])),

  // 2. Translations second
  importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
  ),
],
```

### Key ownership rule

| Where the key is used | Where it lives | How to reference it |
|---|---|---|
| Inside `libs/aum-core` | `aum.{lang}.json` under `"AUM"` | `'AUM.MENU' \| translate` |
| Inside `apps/` or `libs/modules/` | `apps/{app}/src/assets/i18n/{lang}.json` | `'DASHBOARD' \| translate` |

Never put `AUM.*` keys in your app files or flat keys in `aum.*.json`.

---

## Step 8 — Theming & Styling

### `index.html` — required font link

Add the **Material Symbols Outlined** font link inside `<head>`. Without it all `<aum-icon>` instances render as blank boxes.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  rel="stylesheet"
/>
```

> `core.scss` already aliases `.material-icons` → `Material Symbols Outlined`, so no additional CSS is needed. The font link is the only per-app requirement.

If your CSP is strict, ensure `fonts.googleapis.com` is in `style-src` and `fonts.gstatic.com` is in `font-src`.

### `styles.scss`

```scss
@forward 'libs/aum-core/theme/src/lib/styles/core.scss';
// Optional app-level overrides below
```

### `project.json` — SCSS include path (required for `rem()` and mixins)

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["libs/aum-core/theme/src/lib/styles/abstracts/"]
  }
}
```

### Every component SCSS file

```scss
@use 'functions' as *;

.my-component {
  padding: rem(16);                          // scalable, never px
  color: var(--mat-sys-on-surface);          // theme variable, never #hex
  background: var(--mat-sys-surface);
}
```

### HTML — use utility classes for typography

```html
<!-- Correct -->
<div class="flex-column gap-16">
  <span class="fs-24 fw-700">{{ 'PAGE_TITLE' | translate }}</span>
  <span class="fs-14 fw-400">{{ 'PAGE_SUBTITLE' | translate }}</span>
</div>

<!-- Avoid semantic heading tags for sizing — they don't respect UI scaling -->
```

Available font sizes: `fs-12`, `fs-14`, `fs-16`, `fs-18`, `fs-24`
Available font weights: `fw-400`, `fw-500`, `fw-600`, `fw-700`

---

## Step 9 — Assets

Configure asset globs in `project.json`:

```json
{
  "assets": [
    { "glob": "**/*", "input": "apps/{app}/public" },
    {
      "glob": "**/*",
      "input": "apps/{app}/src/assets",
      "output": "assets"
    },
    {
      "glob": "**/*.svg",
      "input": "libs/aum-core/common/src/assets/resources/svgs",
      "output": "assets/svgs"
    },
    {
      "glob": "**/*.json",
      "input": "libs/aum-core/common/src/assets/i18n",
      "output": "assets/i18n"
    }
  ]
}
```

The first entry copies `apps/{app}/src/assets/i18n/{lang}.json` → `assets/i18n/{lang}.json`.
The last entry copies `aum.{lang}.json` → `assets/i18n/aum.{lang}.json`.
Different filenames — no overwrite, no conflict.

---

## Step 10 — Feature Modules

Each feature lives in `libs/modules/{scope}/{feature}/`:

```
libs/modules/{scope}/{feature}/
├─ src/
│  ├─ lib/
│  │  ├─ {feature}.component.ts
│  │  ├─ {feature}.component.html
│  │  └─ {feature}.component.scss   # Must @use 'functions' as *;
│  └─ index.ts                      # Public exports
├─ project.json
├─ tsconfig.json
└─ jest.config.ts
```

Register the path alias in `tsconfig.base.json`:

```json
"@{scope}/{feature}": ["libs/modules/{scope}/{feature}/src/index.ts"]
```

---

## Key Code Templates

### `main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

### `app.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: '{prefix}-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
```

### `app.component.html`

```html
<router-outlet />
```

### `app.config.ts` — loading `app-config.json`

```typescript
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG, MultiTranslateHttpLoader, PaletteService, ThemeService } from '@aum/utils/services';
import appConfigJson from './app-config.json';
import { appRoutes } from './app.routes';

// Merges core library translations (AUM.*) with app-level translations at runtime.
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    { provide: APP_CONFIG, useValue: appConfigJson },
    // Eagerly apply saved palette and theme before any route/component renders
    provideAppInitializer(() => {
      inject(PaletteService);
      inject(ThemeService);
    }),
    // HttpClient MUST come before TranslateModule
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
```

---

## File Generation Checklist

### App files (`apps/{app-name}/`)

- [ ] `project.json` — NX build/serve targets, asset globs, SCSS include paths
- [ ] `src/main.ts` — bootstrap entry
- [ ] `src/index.html` — HTML shell with Material Symbols Outlined font link (required for `<aum-icon>`)
- [ ] `src/app/app.component.ts/html/scss` — root component
- [ ] `src/app/app.config.ts` — providers (correct HttpClient → TranslateModule order)
- [ ] `src/app/app.routes.ts` — route definitions with chosen template
- [ ] `src/app/app-config.json` — nav items, toolbar menus, branding
- [ ] `src/app/environments/*.ts` — environment files
- [ ] `src/styles.scss` — theme import
- [ ] `public/favicon.ico`
- [ ] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
- [ ] `jest.config.ts`, `eslint.config.mjs`

### Module files (for each feature)

- [ ] `src/lib/{feature}.component.ts` — standalone component with `@use 'functions' as *;` in SCSS
- [ ] `src/index.ts` — public export
- [ ] `project.json` — library configuration

### Workspace updates

- [ ] `tsconfig.base.json` — add `@{scope}/*` path aliases

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Module not found `@scope/...` | Add path alias to `tsconfig.base.json` |
| Assets not loading | Check asset globs in `project.json` |
| Content not showing in `PageComponent` | Add `aum-page-body` attribute: `<div aum-page-body>...</div>` |
| Icons render as blank boxes | Add the Material Symbols Outlined font link to `index.html` — see Step 8. `core.scss` handles the CSS alias; the font link is the only per-app requirement |
| `rem()` not working | 1. Add `@use 'functions' as *;` at top of SCSS file. 2. Verify `stylePreprocessorOptions.includePaths` in `project.json` |
| UI not scaling | Replace all `px` with `rem()`. See [BEST_PRACTICES.md](../BEST_PRACTICES.md) |
| Dark mode broken | Replace hardcoded colors with `var(--mat-sys-*)` variables |
| i18n showing raw keys | 1. Ensure `provideHttpClient()` comes before `TranslateModule.forRoot()`. 2. Verify `en.json` exists in `apps/{app}/src/assets/i18n/` and `aum.en.json` is copied from core. 3. Check both asset globs in `project.json`. 4. Confirm using `MultiTranslateHttpLoader` not `TranslateHttpLoader` |
| Core keys (AUM.*) not translating | Ensure the `aum.` prefix glob entry is present in `project.json` assets |
| App keys not translating | Ensure `apps/{app}/src/assets` glob entry covers the `i18n/` subfolder |
| Mobile drawer not closing on nav | Pass `(menuItemClicked)="mobileDrawer.close()"` to the sidebar inside the `mat-sidenav` |

---

_For styling rules and component patterns, refer to [BEST_PRACTICES.md](../BEST_PRACTICES.md). For responsive CSS and TypeScript viewport detection, see [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md)._
