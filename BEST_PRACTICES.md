# AUM UI - Best Practices Guide

This document outlines the best practices, coding standards, and conventions for the AUM UI component library and Angular applications.

## 📋 Table of Contents

- [🏗️ Project Structure](#️-project-structure)
- [🧩 Component Development](#-component-development)
- [🎨 Styling Guidelines](#-styling-guidelines)
- [📝 TypeScript Standards](#-typescript-standards)
- [🧪 Testing Practices](#-testing-practices)
- [⚡ Performance Guidelines](#-performance-guidelines)
- [♿ Accessibility Standards](#-accessibility-standards)
- [🔍 Code Quality](#-code-quality)

---

## 🏗️ Project Structure

### Library Organization

```
libs/
├── aum/                    # Core AUM libraries (prefix: aum)
│   ├── ui/                # Reusable UI components
│   ├── theme/             # Material themes, styles, assets
│   ├── utils/             # Services, interfaces, models
│   └── templates/         # Template components
└── modules/               # App modules (prefix: aum-modules)
   ├── dashboard/         # Dashboard module
   └── playground/        # Component playground
```

### ✅ Do's

- **Keep apps folder light** - Business logic goes in `libs/modules`
- **Use proper prefixes** - `aum` for core libraries, `aum-modules` for app modules
- **Modular architecture** - Each feature as a separate NX library
- **Asset organization** - Put shared assets in `libs/aum/theme/src/assets`

### ❌ Don'ts

- Don't put business logic directly in apps folder
- Don't mix app-specific code with reusable UI components
- Don't create deep nested folder structures

---

## 🧩 Component Development

### Standalone Components

```typescript
@Component({
  selector: 'aum-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  // Component logic here
}
```

### Modern Angular Features

#### Use Signals and Inject

```typescript
export class MyComponent {
  // ✅ Use inject() function
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // ✅ Use signals
  count = signal(0);
  readonly isLoading = signal(false);

  // ✅ Computed signals
  doubleCount = computed(() => this.count() * 2);
}
```

#### Control Flow Syntax

```html
<!-- ✅ Use new control flow syntax -->
@if (isLoading()) {
<div>Loading...</div>
} @else {
<div>Content loaded</div>
} @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
} @empty {
<div>No items found</div>
}
```

### Component Best Practices

#### Input/Output Patterns

```typescript
export class ButtonComponent {
  // ✅ Strongly typed inputs
  @Input() type: 'filled' | 'outlined' | 'basic' | 'icon' = 'filled';
  @Input() size?: 'small' | 'large';
  @Input() disabled = false;

  // ✅ Descriptive event names
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  // ✅ Use signals for reactive state
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();
}
```

#### Content Projection

```html
<!-- ✅ Use specific selectors for content projection -->
<div class="card">
  <ng-content select="[card-header]"></ng-content>
  <ng-content select="[card-body]"></ng-content>
  <ng-content select="[card-footer]"></ng-content>
</div>
```

---

## 🎨 Styling Guidelines

### ⚠️ CRITICAL: UI Development Requirements

**Special care must be taken while developing UI components. The following are MANDATORY:**

#### 1. Material Design System Variables (Light/Dark Theme Support)

```scss
// ✅ REQUIRED: Always use Material system variables for theming
.my-component {
  color: var(--mat-sys-on-surface);
  background-color: var(--mat-sys-surface);
  border: 1px solid var(--mat-sys-outline-variant);
}

// ❌ FORBIDDEN: Never use hardcoded colors
.my-component {
  color: #333; // ❌ Breaks dark mode
  background-color: #fff; // ❌ Not theme-aware
}
```

**Why this matters:**

- **Light/Dark Mode**: System variables automatically adapt to theme changes
- **Theme Consistency**: Ensures uniform appearance across all components
- **Accessibility**: Proper contrast ratios are maintained automatically

#### 2. Scalable Dimensions with rem() Function

```scss
// ✅ REQUIRED: Use rem() function for all dimensions
.my-component {
  padding: rem(16); // Scalable padding
  margin: rem(8) rem(24); // Scalable margins
  font-size: rem(14); // Scalable typography
  border-radius: rem(8); // Scalable border radius
  width: rem(320); // Scalable widths
  height: rem(48); // Scalable heights
}

// ❌ FORBIDDEN: Don't use fixed pixel values
.my-component {
  padding: 16px; // ❌ Not scalable
  margin: 8px 24px; // ❌ Fixed dimensions
  font-size: 14px; // ❌ Breaks UI scaling
}
```

**Why this matters:**

- **UI Scaling**: Supports Default, Large, and Compact display modes
- **User Preference**: Adapts to user's selected display scale
- **Accessibility**: Improves usability for users with different visual needs

#### 3. Complete Theme Coverage

```scss
// ✅ Cover all possible theme states
.button {
  // Base state
  background-color: var(--mat-sys-primary);
  color: var(--mat-sys-on-primary);

  // Hover state
  &:hover {
    background-color: var(--mat-sys-primary-container);
    color: var(--mat-sys-on-primary-container);
  }

  // Disabled state
  &:disabled {
    background-color: var(--mat-sys-surface);
    color: var(--mat-sys-on-surface-variant);
    opacity: 0.6;
  }

  // Focus state
  &:focus {
    outline: rem(2) solid var(--mat-sys-primary);
    outline-offset: rem(2);
  }
}
```

### Responsive Design with Scalable Units

```scss
// ✅ Mobile-first approach using rem() function
.component {
  padding: rem(16); // Scalable base padding

  @media (min-width: 768px) {
    padding: rem(32); // Scales with user preference
  }

  @media (min-width: 1024px) {
    padding: rem(48); // Maintains proportions
  }
}
```

### UI Scaling Support (Default/Large/Compact)

````scss
// ✅ Components must support all display modes
.scalable-component {
  // Base dimensions using rem()
  min-height: rem(44); // Touch target minimum
  padding: rem(12) rem(16); // Comfortable padding
  font-size: rem(14); // Readable text size
  gap: rem(8); // Consistent spacing

  // The rem() function automatically adapts these values based on:
  // - Compact Mode: Smaller spacing and sizing
  // - Default Mode: Standard sizing
  // - Large Mode: Increased sizing for better accessibility
}

### CSS Architecture

```scss
// ✅ Use BEM-like naming for component-specific styles
.aum-button {
  &__label {
    font-weight: 500;
  }

  &__icon {
    margin-right: 0.5rem;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
````

### Utility Classes with Scalable Units

```scss
// ✅ REQUIRED: Use existing utility classes with rem() function
.flex-row-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Spacing utilities - MUST use rem() for scalability */
.margin-8 {
  margin: rem(8);
}
.margin-16 {
  margin: rem(16);
}
.margin-24 {
  margin: rem(24);
}
.padding-8 {
  padding: rem(8);
}
.padding-16 {
  padding: rem(16);
}
.padding-24 {
  padding: rem(24);
}

/* Gap utilities for flex/grid layouts */
.gap-4 {
  gap: rem(4);
}
.gap-8 {
  gap: rem(8);
}
.gap-16 {
  gap: rem(16);
}

/* Typography utilities - Scalable font sizes */
.fs-12 {
  font-size: rem(12);
}
.fs-14 {
  font-size: rem(14);
}
.fs-16 {
  font-size: rem(16);
}
.fs-18 {
  font-size: rem(18);
}
.fs-24 {
  font-size: rem(24);
}
.fw-400 {
  font-weight: 400;
}
.fw-500 {
  font-weight: 500;
}
.fw-600 {
  font-weight: 600;
}
.fw-700 {
  font-weight: 700;
}
```

---

## 📝 TypeScript Standards

### Type Safety

```typescript
// ✅ Define clear interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// ✅ Use union types for limited options
type ButtonType = 'filled' | 'outlined' | 'basic' | 'icon';

// ✅ Use generic types for reusability
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
```

### Service Patterns

```typescript
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  // ✅ Use signals for reactive state management
  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  // ✅ Return observables for async operations
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  // ✅ Use proper error handling
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/api/users', user).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError(() => error);
  }
}
```

---

## 🧪 Testing Practices

### Component Testing

```typescript
describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should emit click event when clicked', () => {
    spyOn(component.buttonClick, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.buttonClick.emit).toHaveBeenCalled();
  });
});
```

### Service Testing

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [{ id: '1', name: 'John', email: 'john@example.com', role: 'user' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

---

## ⚡ Performance Guidelines

### Change Detection Optimization

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ... other config
})
export class OptimizedComponent {
  // ✅ Use signals for reactive updates
  private readonly data = signal<Data[]>([]);

  // ✅ Use trackBy functions for *ngFor
  trackByFn(index: number, item: any): any {
    return item.id;
  }
}
```

### Lazy Loading

```typescript
// ✅ Implement lazy loading for feature modules
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
];
```

### Bundle Optimization

```typescript
// ✅ Use tree-shakable imports
import { MatButtonModule } from '@angular/material/button';

// ❌ Don't import entire libraries
import * as _ from 'lodash';
```

---

## ♿ Accessibility Standards

### Semantic HTML

```html
<!-- ✅ Use semantic elements -->
<button type="button" [attr.aria-pressed]="isPressed">
  <span class="visually-hidden">Toggle navigation</span>
  <mat-icon>menu</mat-icon>
</button>

<!-- ✅ Proper form labeling -->
<label for="email">Email Address</label>
<input id="email" type="email" [attr.aria-describedby]="hasError ? 'email-error' : null" />
<div id="email-error" *ngIf="hasError">Please enter a valid email</div>
```

### ARIA Attributes

```html
<!-- ✅ Use ARIA labels for complex components -->
<div role="tablist" [attr.aria-label]="'Component showcase'">
  <button role="tab" [attr.aria-selected]="isSelected" [attr.aria-controls]="panelId">Tab Label</button>
</div>
```

---

## 🔍 Code Quality

### ESLint Configuration

```typescript
// ✅ Follow consistent naming conventions
export class UserService {} // PascalCase for classes
export const API_BASE_URL = 'https://api.example.com'; // UPPER_CASE for constants
export const userConfig = {}; // camelCase for variables

// ✅ Use meaningful variable names
const getUsersByRole = (role: string) => {};
const isValidEmail = (email: string) => boolean;
```

### Code Documentation

````typescript
/**
 * A reusable button component with multiple variants and sizes.
 *
 * @example
 * ```html
 * <aum-button
 *   type="filled"
 *   size="large"
 *   (buttonClick)="handleClick()">
 *   Click me
 * </aum-button>
 * ```
 */
@Component({
  selector: 'aum-button',
  // ...
})
export class ButtonComponent {
  /**
   * The visual style of the button
   * @default 'filled'
   */
  @Input() type: ButtonType = 'filled';

  /**
   * Emitted when the button is clicked
   */
  @Output() buttonClick = new EventEmitter<MouseEvent>();
}
````

---

## 🚀 Deployment Practices

### Build Optimization

```bash
# ✅ Production builds
nx build aum-core --configuration=production

# ✅ Analyze bundle size
nx build aum-core --stats-json
npx webpack-bundle-analyzer dist/apps/aum-core/stats.json
```

### Environment Configuration

```typescript
// ✅ Use environment-specific configurations
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  enableAnalytics: true,
};
```

---

## 🌐 Internationalization (i18n) Best Practices

### Translation Key Usage

```typescript
// ✅ Use translate pipe in templates
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
<button [tooltip]="'MENU' | translate"></button>

// ✅ Use instant() for TypeScript code
export class MyComponent {
  private languageService = inject(LanguageTranslationService);

  getTranslatedLabel(): string {
    return this.languageService.instant('BUTTON_LABEL');
  }
}
```

### Translation Key Naming

```typescript
// ✅ Use UPPER_CASE_SNAKE_CASE for translation keys
{
  "WELCOME_MESSAGE": "Welcome to AUM",
  "EMAIL_IS_REQUIRED": "Email is required!",
  "PROFILE_UPDATED_SUCCESSFULLY": "Profile updated successfully"
}

// ❌ Don't use camelCase or lowercase
{
  "welcomeMessage": "Welcome",  // ❌ Wrong format
  "email_required": "Email!"     // ❌ Wrong format
}
```

### Language Options Display

```typescript
// ✅ Display language options in readable format for all users
const languageOptions = [
  { label: 'English', value: 'en' },           // Always in English
  { label: '日本語 (Japanese)', value: 'ja' },  // Native + English
  { label: 'हिन्दी (Hindi)', value: 'hi' }     // Native + English
];

// ❌ Don't translate language option labels
const languageOptions = [
  { label: this.translate.instant('ENGLISH'), value: 'en' }, // ❌ Unreadable in other languages
];
```

### Component Translation Integration

```typescript
// ✅ Import TranslateModule in standalone components
@Component({
  selector: 'aum-my-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-component.html',
})
export class MyComponent {
  // Component logic
}
```

### Reactive Language Changes

```typescript
// ✅ Use Angular effects to react to language changes
export class MenuComponent {
  private languageService = inject(LanguageTranslationService);

  constructor() {
    // Rebuild menu when language changes
    effect(() => {
      const currentLang = this.languageService.getLanguage();
      this.buildMenus();
    });
  }
}
```

### Event Handler Order for Language Switching

```typescript
// ✅ CRITICAL: Language switching must be AFTER other operations
onMenuSelect(item: MenuItem) {
  // Handle UI Scale first
  if (item.value === 'compact' || item.value === 'default' || item.value === 'large') {
    this.setUiScale(item.value);
  }

  // Handle Theme second
  if (item.value === 'light' || item.value === 'dark' || item.value === 'system') {
    this.themeService.setTheme(item.value);
  }

  // Handle Language LAST - allows effect() to trigger properly
  if (item.value === 'en' || item.value === 'ja' || item.value === 'hi') {
    this.languageService.setLanguage(item.value);
  }
}

// ❌ Don't put language switching first
onMenuSelect(item: MenuItem) {
  // Language first prevents effect() from working correctly
  if (item.value === 'en' || item.value === 'ja' || item.value === 'hi') {
    this.languageService.setLanguage(item.value);  // ❌ Wrong order
  }
  // ... other operations
}
```

### Translation File Structure

```json
// ✅ Organize keys by feature/component
{
  // Authentication
  "EMAIL_ADDRESS": "Email Address",
  "PASSWORD": "Password",
  "LOGIN": "Login",

  // Navigation
  "DASHBOARD": "Dashboard",
  "SETTINGS": "Settings",

  // Messages
  "PROFILE_UPDATED_SUCCESSFULLY": "Profile updated successfully",
  "AN_ERROR_OCCURRED_TRY_AGAIN": "An error occurred. Please try again."
}
```

---

## 📚 Additional Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [Material Design Guidelines](https://material.angular.dev/guide/system-variables)
- [NX Monorepo Best Practices](https://nx.dev/concepts/monorepos)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🔄 Review Checklist

Before submitting code, ensure:

- [ ] Component follows standalone pattern
- [ ] Uses signals and inject() where appropriate
- [ ] Implements proper TypeScript typing
- [ ] **CRITICAL: Uses Material Design system variables for ALL colors (no hardcoded colors)**
- [ ] **CRITICAL: Uses rem() function for ALL dimensions (no px values)**
- [ ] **CRITICAL: Supports UI scaling (Default/Large/Compact modes)**
- [ ] **CRITICAL: Works perfectly in both light and dark modes**
- [ ] Includes accessibility attributes
- [ ] Has comprehensive tests
- [ ] Follows naming conventions
- [ ] Is properly documented
- [ ] Is responsive across device sizes

### UI Development Critical Checks

- [ ] ✅ No hardcoded color values (#hex, rgb, rgba)
- [ ] ✅ All colors use var(--mat-sys-\*) variables
- [ ] ✅ No pixel (px) values for dimensions
- [ ] ✅ All dimensions use rem() function
- [ ] ✅ Component scales properly in Compact mode
- [ ] ✅ Component scales properly in Large mode
- [ ] ✅ Theme switching works without any visual breaks
- [ ] ✅ Hover/focus/disabled states use theme variables

---

_This document is a living guide and will be updated as the project evolves and new best practices emerge._
