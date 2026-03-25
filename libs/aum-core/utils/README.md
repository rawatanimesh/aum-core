# @aum/utils — AUM Core Services & Utilities

Shared services, interfaces, and models used across all AUM applications.

## Import path

```typescript
import { AppConfigService, APP_CONFIG }    from '@aum/utils/services';
import { ViewportService }                 from '@aum/utils/services';
import { LanguageTranslationService }      from '@aum/utils/services';
import { ThemeService }                    from '@aum/utils/services';
import { AuthService }                     from '@aum/utils/services';
import { ErrorHandlerService }             from '@aum/utils/services';
```

## Services

### `AppConfigService`

Provides reactive signal-based access to `app-config.json`. Inject anywhere in your app.

```typescript
export class MyComponent {
  private appConfig = inject(AppConfigService);

  appName  = this.appConfig.appName;    // Signal<string | undefined>
  navItems = this.appConfig.navItems;   // Signal<SideNavItem[]>
  brandLogo = this.appConfig.brandLogo; // Signal<string>
}
```

Provide the config at bootstrap via the `APP_CONFIG` token:

```typescript
// app.config.ts
import { APP_CONFIG } from '@aum/utils/services';
import appConfigJson from './app-config.json';

providers: [
  { provide: APP_CONFIG, useValue: appConfigJson },
]
```

**`app-config.json` shape:**

```json
{
  "brandLogo": "assets/svgs/brand-logo.svg",
  "appLogo":   "assets/svgs/app-logo.svg",
  "appName":   "My App",
  "navItems": [
    { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard", "selected": true }
  ],
  "toolbarMenus": {
    "preferences": { "show": true, "items": { "theme": { "show": true }, "language": { "show": true } } },
    "profile":     { "show": true, "items": { "logout": { "show": true } } }
  },
  "disableRipple": false
}
```

---

### `ViewportService`

Reactive signal for the current viewport breakpoint. Updates automatically on window resize.

```typescript
export class MyComponent {
  private viewport = inject(ViewportService);

  // 'mobile' | 'tablet' | 'desktop'
  readonly current = this.viewport.current;

  isMobile  = computed(() => this.viewport.current() === 'mobile');
  isDesktop = computed(() => this.viewport.current() === 'desktop');
}
```

**Use for:** conditional rendering, switching component variants, adjusting data fetch page size.
**Do NOT use for:** CSS changes — use the SCSS `@include mobile/tablet/desktop` mixins instead.

Breakpoints match the SCSS variables in `@aum/theme`:
- `mobile` — ≤ 600px
- `tablet` — 601px–960px
- `desktop` — > 960px

See [docs/RESPONSIVE-DESIGN.md](../../../../docs/RESPONSIVE-DESIGN.md) for the full guide.

---

### `LanguageTranslationService`

Wraps `ngx-translate` with a signal-based API for reactive language switching.

```typescript
export class MyComponent {
  private lang = inject(LanguageTranslationService);

  // Switch language
  switchLanguage(code: 'en' | 'ja' | 'hi') {
    this.lang.setLanguage(code);
  }

  // Translate a key in TypeScript (use | translate pipe in templates instead)
  label = this.lang.instant('SAVE');
}
```

Supported languages: **English** (`en`), **Japanese** (`ja`), **Hindi** (`hi`).

---

### `ThemeService`

Manages light/dark/system theme switching.

```typescript
export class MyComponent {
  private theme = inject(ThemeService);

  setDark()   { this.theme.setTheme('dark'); }
  setLight()  { this.theme.setTheme('light'); }
  setSystem() { this.theme.setTheme('system'); }
}
```

---

### `AuthService` / `AuthGuardService`

Provides authentication state and an `AuthGuard` for protecting routes.

```typescript
// app.routes.ts
{ path: '', component: AumTemplate2, canActivate: [AuthGuardService], children: [...] }
```

---

### `ErrorHandlerService`

Global Angular error handler. Catches unhandled runtime errors and logs them with structured context. Registered automatically when the utils library is imported.

## Interfaces

Key interfaces exported from this library:

| Interface | Purpose |
|-----------|---------|
| `AppConfig` | Shape of `app-config.json` |
| `SideNavItem` | Nav item with optional `children` for nested menus |
| `ToolbarMenuConfig` | Toolbar preferences/profile menu visibility config |
| `MenuItemConfig` | Per-item `show` / `disabled` flags |

## Running tests

```bash
nx test aum-core-utils
```
