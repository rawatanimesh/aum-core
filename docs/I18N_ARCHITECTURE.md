# Internationalization (i18n) Architecture

## Overview

AUM Core uses a **namespace-based i18n architecture** that separates core library translations from application-level translations, preventing key collisions and enabling scalable multi-app development.

---

## Architecture Principles

### 1. Two-Source Translation System

**Core Library Translations** (`AUM.*` namespace):
- Location: `libs/aum-core/common/src/assets/i18n/aum.{lang}.json`
- Keys are namespaced under `"AUM": { ... }`
- Used by aum-core components and services
- Contains generic, reusable keys (UI chrome, auth, error messages, form controls)

**Application Translations** (flat structure):
- Location: `apps/{app-name}/src/assets/i18n/{lang}.json`
- Keys are at root level (no namespace)
- Used by app-specific components
- Each app maintains its own translation files

### 2. Runtime Merging

Both translation sources are merged at runtime using `MultiTranslateHttpLoader`:

```typescript
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' },  // Core: AUM.* keys
    { prefix: './assets/i18n/', suffix: '.json' },       // App: flat keys
  ]);
}
```

### 3. Zero Collision Guarantee

- **Core keys**: Always prefixed with `AUM.` (e.g., `AUM.MENU`, `AUM.LOGOUT`)
- **App keys**: Never use `AUM.` prefix (e.g., `DASHBOARD`, `WELCOME_MESSAGE`)
- Different namespaces = impossible to collide

---

## Key Ownership Rules

| Component Location | Translation File | Key Format | Example |
|---|---|---|---|
| `libs/aum-core/**` | `aum.{lang}.json` | `AUM.KEY_NAME` | `AUM.MENU`, `AUM.LOGOUT` |
| `apps/{app}/**` | `{lang}.json` | `KEY_NAME` | `DASHBOARD`, `WELCOME_MESSAGE` |

---

## Translation Files Structure

### AUM Core Keys

**Location:** `libs/aum-core/common/src/assets/i18n/aum.en.json`

```json
{
  "AUM": {
    "CLOSE": "Close",
    "COMPACT": "Compact",
    "DARK": "Dark",
    "DEFAULT": "Default",
    "DISPLAY": "Display",
    "DRAG_AND_DROP_HERE": "Drag and drop here",
    "BROWSE_FILE": "Browse File",
    "DOWNLOAD_TEMPLATE": "Download Template",
    "OR": "or",
    "MAXIMUM_FILE_SIZE_IS": "Maximum file size is",
    "FILE_TYPE": "File Type",
    "FILES_SELECTED": "files selected",
    "EMAIL_ADDRESS": "Email Address",
    "EMAIL_IS_REQUIRED": "Email is required!",
    "END_DATE": "End date",
    "ENTER_PASSWORD": "Enter password",
    "ENTER_YOUR_EMAIL": "Enter your email",
    "GO_TO_HOME": "Go to Home",
    "INVALID_EMAIL_FORMAT": "Invalid email format.",
    "LANGUAGE": "Language",
    "LANGUAGE_CHANGED_SUCCESSFULLY": "Language changed successfully",
    "LARGE": "Large",
    "LIGHT": "Light",
    "LOGIN": "Login",
    "LOGOUT": "Logout",
    "MENU": "Menu",
    "MORE_OPTIONS": "More options",
    "MY_ACCOUNT": "My Account",
    "PAGE_NOT_FOUND": "Page Not Found",
    "PASSWORD": "Password",
    "PASSWORD_IS_REQUIRED": "Password is required!",
    "PREFERENCES": "Preferences",
    "PROFILE": "Profile",
    "SELECT_DATE": "Select date",
    "SETTINGS": "Settings",
    "SIGN_IN": "Sign in",
    "SIGN_IN_WITH": "Sign in with",
    "START_DATE": "Start date",
    "SYSTEM": "System",
    "TEMPLATE": "Template",
    "TEMPLATE_1": "Template 1",
    "TEMPLATE_2": "Template 2",
    "THEME": "Theme",
    "ERROR_OCCURRED": "An error occurred. Please try again.",
    "NETWORK_ERROR": "Network error. Please check your connection.",
    "UNABLE_TO_CONNECT": "Unable to connect to server. Please check your connection.",
    "INVALID_REQUEST": "Invalid request. Please check your input.",
    "SESSION_EXPIRED": "Session expired. Please log in again.",
    "PERMISSION_DENIED": "You do not have permission to perform this action.",
    "RESOURCE_NOT_FOUND": "The requested resource was not found.",
    "CONFLICT_ERROR": "Conflict occurred. The resource may have been modified.",
    "VALIDATION_FAILED": "Validation failed. Please check your input.",
    "SERVER_ERROR": "Server error. Please try again later.",
    "SERVICE_UNAVAILABLE": "Service temporarily unavailable. Please try again later.",
    "REQUEST_TIMEOUT": "Request timeout. Please try again."
  }
}
```

### App-Level Keys

**Location:** `apps/demo-app/src/assets/i18n/en.json`

```json
{
  "WELCOME_MESSAGE": "Welcome to AUM",
  "WELCOME_SUBTITLE": "Angular UI Mods - A comprehensive component library for modern Angular applications",
  "DASHBOARD": "Dashboard",
  "PLAYGROUND": "Playground",
  "ABOUT": "About",
  ...
}
```

---

## Component Usage Examples

### Core Component (uses AUM.* keys)

**login.ts:**
```html
<aum-input
  [label]="'AUM.EMAIL_ADDRESS' | translate"
  [placeholder]="'AUM.ENTER_YOUR_EMAIL' | translate"
  [customErrorMessages]="{
    email: 'AUM.INVALID_EMAIL_FORMAT' | translate,
    required: 'AUM.EMAIL_IS_REQUIRED' | translate
  }"
></aum-input>

<aum-button [value]="'AUM.LOGIN' | translate"></aum-button>
```

**page-not-found.ts:**
```html
<span>{{ 'AUM.PAGE_NOT_FOUND' | translate }}</span>
<aum-button [value]="'AUM.GO_TO_HOME' | translate"></aum-button>
```

### App Component (uses flat keys)

**dashboard.component.html:**
```html
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
<p>{{ 'WELCOME_SUBTITLE' | translate }}</p>
<nav>{{ 'DASHBOARD' | translate }}</nav>
```

---

## Project Configuration

### App Configuration (app.config.ts)

```typescript
import { MultiTranslateHttpLoader } from '@aum/utils/services';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Translations (TranslateModule)
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
    // 2. HttpClient with interceptors
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ],
};

// Merges core library translations (AUM.*) with app-level translations at runtime.
// Core keys live under the AUM namespace; app keys are at root level — no collision possible.
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}
```

### Asset Configuration (project.json)

```json
{
  "assets": [
    {
      "glob": "**/*",
      "input": "apps/demo-app/src/assets",
      "output": "assets"
    },
    {
      "glob": "**/*.json",
      "input": "libs/aum-core/common/src/assets/i18n",
      "output": "assets/i18n"
    }
  ]
}
```

**Result:** Both sets of files are copied to `dist/assets/i18n/`:
- `aum.en.json`, `aum.hi.json`, `aum.ja.json` (core keys)
- `en.json`, `hi.json`, `ja.json` (app keys)

---

## Adding New Translations

### Adding Core Keys (for aum-core developers)

1. Add key to **all three** language files:
   - `libs/aum-core/common/src/assets/i18n/aum.en.json`
   - `libs/aum-core/common/src/assets/i18n/aum.hi.json`
   - `libs/aum-core/common/src/assets/i18n/aum.ja.json`

2. Use `AUM.` prefix in all core components:
   ```html
   {{ 'AUM.NEW_KEY' | translate }}
   ```

3. Keys should be **generic and reusable** across apps

### Adding App Keys (for app developers)

1. Add key to **all three** language files:
   - `apps/{app}/src/assets/i18n/en.json`
   - `apps/{app}/src/assets/i18n/hi.json`
   - `apps/{app}/src/assets/i18n/ja.json`

2. Use **flat keys** (no namespace):
   ```html
   {{ 'NEW_KEY' | translate }}
   ```

3. Keys can be **app-specific**

---

## Supported Languages

- **English (en)**: Default language
- **Hindi (hi)**: Secondary language
- **Japanese (ja)**: Secondary language

To add more languages:
1. Create `aum.{lang}.json` in `libs/aum-core/common/src/assets/i18n/`
2. Create `{lang}.json` in each app's `src/assets/i18n/`
3. Update the language menu in the toolbar component

---

## Benefits of This Architecture

- **Zero Key Collisions** - Core and app keys can never conflict
- **Clear Ownership** - Easy to determine which team maintains which keys
- **Scalable** - Multiple apps can coexist without translation conflicts
- **Reusable Core** - Generic keys shared across all applications
- **App Flexibility** - Each app controls its own translations

---

## Migration Notes

### From Old Architecture

**Before (unified translations):**
```
libs/aum-core/common/src/assets/i18n/
├── en.json  (all keys mixed)
├── hi.json  (all keys mixed)
└── ja.json  (all keys mixed)
```

**After (namespace separation):**
```
libs/aum-core/common/src/assets/i18n/
├── aum.en.json  (AUM.* keys only)
├── aum.hi.json  (AUM.* keys only)
└── aum.ja.json  (AUM.* keys only)

apps/demo-app/src/assets/i18n/
├── en.json  (app keys only)
├── hi.json  (app keys only)
└── ja.json  (app keys only)
```

---

## Troubleshooting

### Translations Not Loading

**Problem:** Keys showing as `AUM.MENU` instead of translated text

**Solutions:**
1. Verify `TranslateModule.forRoot()` is configured with `MultiTranslateHttpLoader`
2. Check both asset globs are in `project.json`
3. Confirm `MultiTranslateHttpLoader` is used (not `TranslateHttpLoader`)
4. Verify translation files exist in correct locations

### Core Keys Not Working

**Problem:** `AUM.*` keys not translating

**Solutions:**
1. Check `aum.{lang}.json` files exist in `libs/aum-core/common/src/assets/i18n/`
2. Verify the asset glob for core i18n files is in `project.json`
3. Ensure the key exists in all language files (`en`, `hi`, `ja`)

### App Keys Not Working

**Problem:** App-specific keys not translating

**Solutions:**
1. Check `{lang}.json` files exist in `apps/{app}/src/assets/i18n/`
2. Verify app i18n asset glob is configured in `project.json`
3. Ensure keys are **not** using the `AUM.` prefix

---

## Related Documentation

- [DEV-GUIDELINES.md](./DEV-GUIDELINES.md) - Development standards and conventions
- [ARCHITECTURE.MD](./ARCHITECTURE.MD) - Overall project architecture

---

_Last Updated: April 2026_
