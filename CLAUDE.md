# Claude Configuration for AUM Core

## 📋 MANDATORY: Read These Files First

Before making ANY changes to this codebase, you MUST read and follow:

1. **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Complete coding standards and guidelines
2. **[README.md](./README.md)** - Project documentation and setup
3. **[CHANGELOG.md](./CHANGELOG.md)** - Recent changes and features

---

## 🚨 CRITICAL RULES (Never Violate)

### AUM Component Catalog (MANDATORY — Check Before Using Any mat-* Component)

Always use `aum-*` wrappers. Only fall back to raw `mat-*` if no wrapper exists.

| Use case | AUM component | Import from |
|---|---|---|
| Buttons | `<aum-button>` | `@aum/ui/buttons` |
| Toggle button group | `<aum-button-toggle>` | `@aum/ui/buttons` |
| Tabs | `<aum-tab-group>`, `<aum-tab>` | `@aum/ui/layout` |
| Page layout | `<aum-page>` | `@aum/ui/layout` |
| Generic dialog | `<aum-generic-dialog>` | `@aum/ui/dialogs` |
| Confirmation dialog | `ConfirmationDialogService` | `@aum/ui/dialogs` |
| Nav menu | `<aum-menu-list>` | `@aum/ui/navigation` |
| Breadcrumb | `<aum-breadcrumb>` | `@aum/ui/navigation` |
| Snackbar | `SnackbarService` | `@aum/ui/utilities` |
| Spinner | `<aum-spinner>` | `@aum/ui/utilities` |
| Icon | `<aum-icon>` | `@aum/ui/utilities` |

### Icons (MANDATORY)
```html
<!-- ✅ ALWAYS use aum-icon — NEVER mat-icon -->
<aum-icon name="check" [width]="18"></aum-icon>
<aum-icon name="star" color="primary"></aum-icon>

<!-- Color presets: 'primary' | 'secondary' | 'tertiary' | 'error' | 'on-surface' | 'on-surface-variant' -->
<!-- Or raw CSS: color="var(--mat-sys-outline)" -->
```

### Icon + Text Buttons
```html
<!-- ✅ Pass both [icon] and [value] for icon+text buttons -->
<aum-button type="filled" icon="add" value="Add Item"></aum-button>
<aum-button type="outlined" icon="download" value="Export"></aum-button>
```

### Styling Rules (MANDATORY)
```scss
// ✅ ALWAYS use Material Design system variables
background-color: var(--mat-sys-surface);
color: var(--mat-sys-on-surface);

// ✅ ALWAYS use rem() function for ALL dimensions
padding: rem(16);
font-size: rem(14);

// ❌ NEVER use hardcoded colors or pixel values
background-color: #ffffff;  // ❌ FORBIDDEN
padding: 16px;              // ❌ FORBIDDEN

// ❌ NEVER use inline styles
<div style="padding: 20px">  // ❌ FORBIDDEN
```

### Responsive Design (MANDATORY)
```scss
// ✅ ALWAYS use project mixins — NEVER write raw media queries
@use 'libs/aum-core/theme/src/lib/styles/abstracts/mixins' as *;

.component {
  padding: rem(16); // desktop default

  @include tablet { padding: rem(12); }
  @include mobile { padding: rem(8); }
}

// ✅ Prevent horizontal overflow at layout roots
.page-container {
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

// ✅ Flex/grid children — prevent overflow
.flex-child { min-width: 0; }
```

Breakpoints: mobile ≤ 600px · tablet 601–960px · desktop > 960px

### Angular 21+ Patterns (MANDATORY)
```typescript
// ✅ ALWAYS use standalone components
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })

// ✅ ALWAYS use inject() function
private service = inject(MyService);

// ✅ ALWAYS use signals for state
count = signal(0);
readonly value = this._value.asReadonly();

// ✅ ALWAYS use new control flow syntax
@if (condition) { }
@for (item of items(); track item.id) { }

// ✅ ALWAYS use takeUntilDestroyed() — NO manual unsubscribe
constructor() {
  this.eventBus.on(AppEventType.X)
    .pipe(takeUntilDestroyed())
    .subscribe(...);
}
```

### Internationalization (MANDATORY)
```html
<!-- ✅ ALWAYS use translate pipe for ALL text -->
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>

<!-- ❌ NEVER hardcode text -->
<h1>Welcome to AUM</h1>  <!-- ❌ FORBIDDEN -->
```

**Two-source translation architecture:**
- Core library keys → `libs/aum-core/common/src/assets/i18n/aum.{lang}.json` under `"AUM"` namespace
- App keys → `apps/<app>/src/assets/i18n/{lang}.json` at root level

```html
<!-- Core component key -->
<button [tooltip]="'AUM.MENU' | translate"></button>
<!-- App key -->
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
```

### Language Switching Order (CRITICAL)
```typescript
// ✅ Language switching must be LAST in event handlers
onMenuSelect(item: MenuItem) {
  if (item.value === 'compact') { /* UI Scale first */ }
  if (item.value === 'light') { /* Theme second */ }
  if (item.value === 'en') { /* Language LAST */ }
}
```

---

## 🎯 Quick Reference

### Supported Languages
- English (en) - Default
- 日本語 (ja) - Japanese
- हिन्दी (hi) - Hindi

### Technology Stack
- Angular 21
- NX 22.3.3
- Material Design 3
- TypeScript 5.8
- ngx-translate 15.0.0

### Translation Key Format
```json
{
  "WELCOME_MESSAGE": "...",  // ✅ UPPER_CASE_SNAKE_CASE
  "EMAIL_IS_REQUIRED": "..." // ✅ CORRECT
}
```

---

## ✅ Pre-Commit Checklist

Before committing code, verify:
- [ ] **Checked AUM catalog** — no raw `mat-*` where `aum-*` exists; never `<mat-icon>`
- [ ] **No hardcoded colors** - only var(--mat-sys-*)
- [ ] **No pixel values** - only rem() function
- [ ] **No inline styles**
- [ ] Standalone component with `ChangeDetectionStrategy.OnPush`
- [ ] Uses inject() for dependencies
- [ ] Uses signals for state; `asReadonly()` on public signals
- [ ] Uses `takeUntilDestroyed()` — no manual OnDestroy subscriptions
- [ ] Uses new control flow (@if, @for)
- [ ] Imports TranslateModule
- [ ] All text uses translate pipe
- [ ] Core keys under `AUM.*` in `aum.{lang}.json`; app keys in `{lang}.json`
- [ ] Translation keys in UPPER_CASE_SNAKE_CASE
- [ ] Language switching is LAST in event handlers
- [ ] Works in both light and dark modes
- [ ] Works across all three color palettes (Purple, Ocean Blue, Sea Green)
- [ ] Responsive: mobile/tablet/desktop via `@include` mixins (no raw media queries)
- [ ] No horizontal overflow on any viewport

---

**For complete details, see [BEST_PRACTICES.md](./BEST_PRACTICES.md)**
