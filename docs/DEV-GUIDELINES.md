# AUM UI - Development Guidelines & Architecture Standards

**Version:** 1.0
**Audience:** Development Teams, Contributors, Architects
**Last Updated:** March 2026

---

## Introduction

This document establishes high-level technical standards and architectural principles for all development in this repository. These guidelines ensure consistency, maintainability, scalability, and quality across the component library and demo applications.

> **Note:** For detailed coding patterns and implementation examples, refer to [BEST_PRACTICES.md](../BEST_PRACTICES.md).

### Priority Levels

- **Critical** - Non-negotiable, must be followed
- **High Priority** - Strongly recommended; exceptions require justification
- **Standard** - Best practice guidelines

---

## 1. Architecture & Project Structure

### Nx Monorepo Architecture — Critical

**Principle:** Clear separation between reusable infrastructure and business/demo features.

```
apps/                           # Lightweight entry points only
libs/
├── aum-core/                   # Reusable framework libraries
│   ├── ui/                     # Shared UI components
│   ├── theme/                  # Design system, theming, SCSS abstracts
│   ├── utils/                  # Shared services & interfaces
│   ├── common/                 # Common components (login, 404) and assets
│   └── templates/              # Application shell templates
└── modules/                    # Feature/demo modules
    └── demo/
        ├── dashboard/
        └── playground/
```

**Key rules:**
- **Apps folder** — configuration, bootstrap, routes, and app-specific assets only; no business logic
- **`libs/aum-core/`** — reusable across all apps; must not import from `libs/modules/`
- **Feature modules** — business logic; can import from `aum-core`, must not create circular dependencies
- **Enforce boundaries** — use Nx module boundary rules to prevent illegal imports

---

## 2. Framework & Technology Standards

### Angular Version Policy — Critical

Maintain Angular at the current major version or N-1.

**Update strategy:**
- Security patches → Immediate
- Minor versions → Monthly review
- Major versions → Quarterly, with comprehensive testing

### Modern Angular Features — Critical

Always use the latest Angular patterns:

- **Standalone components** — no NgModules
- **Signals** — for component and service state (`signal()`, `computed()`, `effect()`)
- **Modern control flow** — `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`)
- **`inject()` function** — instead of constructor injection
- **Lazy loading** — all routes use `loadComponent` or `loadChildren`
- **Deferrable views** — `@defer` for non-critical UI sections

### Dependency Consistency — High Priority

All applications in the workspace must use the same version of shared dependencies (Angular Material, RxJS, ngx-translate, etc.). Do not mix versions.

---

## 3. Code Quality & Standards

### Code Formatting — Critical

Prettier is configured at the workspace root. All code must be formatted before committing.

- Enable **format on save** in your IDE
- Pre-commit hooks enforce formatting

### Linting & Type Safety — Critical

- Angular ESLint rules must pass with no errors
- TypeScript strict mode is enabled — no `any` types; use `unknown` where a type is genuinely unknown
- Explicit return types on all public service methods and component outputs
- Nx module boundary rules enforced (`@nx/enforce-module-boundaries`)

### Naming Conventions — High Priority

| Entity | Convention | Example |
|--------|-----------|---------|
| Files | kebab-case with suffix | `user.service.ts`, `button.component.ts` |
| Classes | PascalCase | `UserService`, `ButtonComponent` |
| Variables / functions | camelCase | `getUserById`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| Translation keys | UPPER_SNAKE_CASE | `PROFILE_UPDATED_SUCCESSFULLY` |
| Component selectors | `aum-` prefix | `aum-button`, `aum-card` |

---

## 4. UI/UX Consistency

### Use the Shared Component Library — Critical

All UI must use components from `libs/aum-core/ui/`. Do not rebuild components that already exist.

**Mandatory for:**
- Buttons, inputs, selects, checkboxes, radio buttons
- Dialogs, tooltips, snackbars
- Navigation (menus, breadcrumbs, side menu)
- Loading indicators, spinners
- Date pickers, autocomplete, form controls

**Exception process:** If the library lacks required functionality, contribute a new component to `libs/aum-core/ui/` rather than building a one-off custom component in a feature module.

### Standardized Feedback & Error Handling — Critical

- Use `SnackbarService` for all user notifications (success, error, warning, info)
- Use `ConfirmationDialogComponent` for destructive actions (delete, reset, logout)
- Show empty-state UI with clear messaging when lists or data are empty
- Show loading states for all async operations
- Never display raw stack traces or technical error messages to users

### Confirmation Dialogs — Critical

Use `ConfirmationDialogComponent` for:
- Destructive actions (delete, remove, clear)
- Data loss warnings
- Irreversible operations

---

## 5. Theming & Styling

### Material Design 3 System Variables — Critical

All colors must use Material system CSS variables. No hardcoded hex, rgb, or rgba values.

```scss
// Correct
.component {
  color: var(--mat-sys-on-surface);
  background: var(--mat-sys-surface);
  border: rem(1) solid var(--mat-sys-outline-variant);
}

// Wrong
.component {
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
}
```

### Scalable Dimensions — Critical

All dimensions must use the `rem()` function. No `px` values.

```scss
@use 'functions' as *;

.component {
  padding: rem(16);       // not 16px
  font-size: rem(14);     // not 14px
  border-radius: rem(8);  // not 8px
  gap: rem(8);            // not 8px
}
```

The `rem()` function is globally available via `stylePreprocessorOptions.includePaths` — no import needed in component SCSS files.

### UI Scale Mode Support — Critical

Components must work correctly in all three display modes (Compact / Default / Large). These modes shift the root `font-size`, so any component using `rem()` scales automatically. Validate visually in all three modes before committing.

### Light/Dark Mode — Critical

Components must work in both light and dark themes without visual breaks. All interactive states (hover, focus, disabled, selected) must use theme variables. Test by toggling theme via the preferences menu.

### Responsive Design — High Priority

Use the SCSS breakpoint mixins for CSS-level responsiveness and `ViewportService` for conditional rendering in TypeScript. See [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) for the full guide.

```scss
// Mobile-first example
.card {
  flex-direction: column;

  @include desktop {
    flex-direction: row;
  }
}
```

---

## 6. Accessibility

### Standards Target

WCAG 2.1 Level AA compliance for all components and pages.

### Requirements — Critical

- All interactive elements must be keyboard-navigable
- Icon-only buttons must have an `aria-label` or `title`
- Form inputs must have associated `<label>` or `aria-label`
- Color is not the sole means of conveying information
- Focus indicators must be visible
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text

### Testing

- Run Lighthouse accessibility audit (target score ≥ 90)
- Manually test keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Verify focus management in dialogs and overlays

---

## 7. Performance

### Lazy Loading — Critical

All feature routes must use lazy loading:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('@demo/dashboard').then(m => m.Dashboard),
}
```

Initial bundle should remain under 500 KB (gzipped).

### Change Detection — High Priority

Use `ChangeDetectionStrategy.OnPush` for all components that do not require default change detection. Prefer signals over observables for local component state.

### Bundle Size — Standard

- Use `trackBy` / `track` for all list rendering
- Tree-shake imports — prefer specific imports over barrel imports where bundle size matters
- Run `nx build demo-app --stats-json` periodically and review with a bundle analyser

---

## 8. Security

### Input Validation — Critical

- Validate all user input on the client for UX
- Never trust client-side validation as a security boundary
- Sanitize any HTML content before rendering
- Handle all edge cases: null, undefined, empty string, boundary values

### No Hardcoding — Critical

Never commit to code:
- API keys, tokens, passwords
- Environment-specific URLs
- Business rule thresholds
- Feature flag values

Use environment files and `AppConfigService`.

### Dependency Security — Standard

```bash
npm audit
```

Run audits regularly. Address high and critical vulnerabilities promptly.

---

## 9. Internationalization (i18n)

### All User-Facing Text Must Be Translatable — Critical

- Use `TranslateModule` and the `| translate` pipe in all templates
- Use `LanguageTranslationService.instant()` for TypeScript-side translations
- Translation keys must be `UPPER_SNAKE_CASE`
- Never display raw translation keys to users

### Two-Source Namespace Architecture — Critical

AUM separates library translations from app translations using a namespaced two-file approach:

- **Core keys** live in `libs/aum-core/common/src/assets/i18n/aum.{lang}.json` under the `"AUM"` namespace — used as `'AUM.KEY' | translate`
- **App keys** live in `apps/{app}/src/assets/i18n/{lang}.json` at root level — used as `'KEY' | translate`

This makes collision **structurally impossible** — a developer would have to deliberately write `"AUM": { ... }` in their app file to cause a conflict.

**Rule:** If a key is used even once inside `libs/aum-core`, it belongs in `aum.{lang}.json` under `AUM.*`. All other keys belong in the app's own `{lang}.json`.

```typescript
// Core component (inside libs/aum-core)
[tooltip]="'AUM.MENU' | translate"

// App component (inside apps/ or libs/modules/)
{{ 'DASHBOARD' | translate }}
```

Use `MultiTranslateHttpLoader` from `@aum/utils/services` to merge both sources at runtime:

```typescript
import { MultiTranslateHttpLoader } from '@aum/utils/services';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}
```

### Provider Order — Critical

`provideHttpClient()` must appear before `TranslateModule.forRoot()` in `app.config.ts`. Reversing this order causes translations to fail silently.

### Language Options — Standard

Display language names in their native form, not translated:

```typescript
// Correct
{ label: 'English', value: 'en' }
{ label: '日本語 (Japanese)', value: 'ja' }
{ label: 'हिन्दी (Hindi)', value: 'hi' }

// Wrong — unreadable to non-English users
{ label: this.translate.instant('ENGLISH'), value: 'en' }
```

---

## 10. Configuration Management

### Centralised App Config — High Priority

All app-level configuration (nav items, toolbar menus, branding, feature flags, user preference defaults) must go through `AppConfigService` and be driven from `app-config.json`. Do not scatter configuration across components.

The `defaults` block in `app-config.json` sets the initial values for user preferences on a fresh session (no saved localStorage). Once a user makes a choice it is persisted in localStorage and the config default no longer applies for that preference. This is the correct place to set per-app defaults — never hardcode them inside components.

```json
"defaults": {
  "template": "template-2",
  "theme": "light",
  "displayMode": "default",
  "language": "en"
}
```

### No Magic Numbers or Strings — Standard

Extract repeated values into named constants or configuration. Avoid inline values like `setTimeout(() => {}, 3000)` or `if (status === 'active')` without a named constant.

---

## 11. DevOps & Automation

### CI Checks — Critical

All code must pass before merge:
- ESLint — no errors
- TypeScript compilation — no errors
- Unit tests — pass with coverage
- Build verification — `nx build` succeeds

### Shell Scripts — High Priority

Automation scripts for common operations (build, deploy, environment setup) should use configurable variables at the top and be stored in the `scripts/` directory.

---

## 12. Cross-Browser Compatibility

### Target Browsers — Critical

Support last 2 versions of:
- Chrome / Edge (Chromium)
- Firefox
- Safari

### Cross-Browser Testing — Critical

Before a release, verify in all target browsers:
- Responsive layout at mobile, tablet, desktop breakpoints
- Zoom levels 75%–200%
- Keyboard navigation
- Light and dark mode

---

## 13. Code Review Checklist

### Before Opening a PR

- [ ] Formatted with Prettier
- [ ] ESLint passes — no errors
- [ ] All tests pass
- [ ] Used shared component library — no one-off custom duplicates
- [ ] No hardcoded colors or pixel values
- [ ] No hardcoded secrets or URLs
- [ ] Proper error handling and edge cases covered
- [ ] Accessibility attributes added
- [ ] All user-facing text uses translation keys
- [ ] Tested in light and dark mode
- [ ] Tested in Compact, Default, and Large UI scale modes
- [ ] No `console.log` or debugging artifacts

### Reviewer Checklist

- [ ] Follows Nx monorepo architecture — no boundary violations
- [ ] No security vulnerabilities introduced
- [ ] Uses modern Angular patterns (signals, standalone, `inject()`)
- [ ] Responsive behaviour verified
- [ ] Documentation updated if public API changed

### Pull Request Requirements

- Minimum 1 approval
- All CI checks pass
- No merge conflicts
- PR description includes context and testing notes
- Breaking changes clearly documented

---

## 14. Development Workflow

### Git Branch Naming

```
feature/short-description
bugfix/short-description
hotfix/critical-fix
docs/update-readme
```

### Commit Messages (Conventional Commits)

```
feat: add upload-box component
fix: correct dark mode border color in card
docs: update ARCHITECTURE.MD with template comparison
refactor: migrate sidenav to signals
```

---

## Resources

- [Angular Documentation](https://angular.dev/)
- [Nx Monorepo Docs](https://nx.dev/)
- [Angular Material System Variables](https://material.angular.dev/guide/system-variables)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [BEST_PRACTICES.md](../BEST_PRACTICES.md) — detailed coding patterns
- [NEW-APP-SETUP.md](./NEW-APP-SETUP.md) — scaffolding a new app
- [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) — breakpoints and ViewportService

---

**Document Owner:** Core Team
**Next Review:** Quarterly
