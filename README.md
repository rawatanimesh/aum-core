# Angular UI Mods - AUM

A modern Angular component library built with NX monorepo architecture, featuring Material Design 3 theming, standalone components, and comprehensive UI components.

## 📚 Documentation

- **[📋 Best Practices](./BEST_PRACTICES.md)** - Coding standards, conventions, and development guidelines
- **[🏗️ Architecture](./docs/ARCHITECTURE.MD)** - Technical architecture, design decisions, and project structure
- **[🤝 Contributing](./CONTRIBUTING.md)** - Developer contribution guide and workflow
- **[🚀 Getting Started](#-getting-started)** - Quick start guide and development setup
- **[📖 Component Guide](#-component-library)** - Available components and usage examples
- **[🎨 Theming](#-theming)** - Theme customization and usage
- **[📁 Project Structure](#-project-structure)** - Directory organization
- **[🤝 Contributing](#-contributing)** - How to contribute to the project

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v22.17.0
- **npm**: Latest version
- **Angular CLI**: v20.x
- **NX CLI**: v21.x (optional but recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aum-core

# Install dependencies
npm install

# Start development server
npm run serve
# or using NX
nx serve demo-app
```

## 🏃‍♂️ Development Commands

### Serve

```bash
# Development server
nx serve demo-app
# or
nx run demo-app:serve:development
```

### Build

```bash
# Production build
nx build demo-app --configuration=production

# Development build
nx build demo-app --configuration=development
```

### Testing

```bash
# Run tests
nx test demo-app

# Run tests with coverage
nx test demo-app --coverage

# Run linting
nx lint demo-app
```

## 📖 Component Library

### Available Components

#### Buttons & Actions

- **ButtonComponent** - Multi-variant buttons with icon support
- **MenuListComponent** - Dropdown menus with nested options

#### Form Controls

- **InputComponent** - Text input with validation
- **CheckboxComponent** - Checkbox with indeterminate state
- **RadioButtonComponent** - Radio button groups
- **DatePickerComponent** - Date selection with calendar
- **SelectBoxComponent** - Single and multi-select dropdowns
- **AutocompleteComponent** - Auto-completing input field

#### Layout & Navigation

- **PageComponent** - Standard page layout with breadcrumbs
- **CardComponent** - Content container with shadow
- **BreadcrumbComponent** - Navigation breadcrumbs

#### Feedback & Dialogs

- **ConfirmationDialogComponent** - Yes/No confirmation dialogs
- **GenericDialogComponent** - Customizable modal dialogs
- **SnackbarService** - Toast notifications
- **DrawerComponent** - Side panel for additional content
- **SpinnerComponent** - Loading indicators (page and element modes)

#### Services

- **LanguageTranslationService** - Multi-language support with English, Japanese, and Hindi
- **ErrorHandlerService** - Global error handling with structured logging
- **AuthService** - Authentication and route protection
- **ApplicationConfigService** - Centralized application configuration

### Usage Example

```typescript
import { ButtonComponent } from '@aum/ui/buttons';
import { CardComponent } from '@aum/ui/layout';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  template: `
    <aum-card>
      <div card-body>
        <h2>Welcome to AUM UI</h2>
        <aum-button type="filled" value="Get Started" (buttonClick)="handleClick()"> </aum-button>
      </div>
    </aum-card>
  `,
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

## 🎨 Theming

### Generate Custom Theme

```bash
npx nx g @angular/material:theme-color --project=aum-core
```

**Default Theme Colors:**

- Primary: `#6E57E0` (Purple)
- Secondary: `#ffffff` (White)
- Error: `#DF0101` (Red)

**Theme Builder:** [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)

### Using Theme Variables

```scss
.my-component {
  color: var(--mat-sys-on-surface);
  background-color: var(--mat-sys-surface);
  border: 1px solid var(--mat-sys-outline-variant);
}
```

## 📁 Project Structure

```
aum-core/
├── apps/demo-app/              # Main demo application (lightweight)
├── libs/
│   ├── aum-core/               # Core AUM framework libraries (prefix: aum)
│   │   ├── ui/                 # Reusable UI components
│   │   ├── theme/              # Styles, themes, assets
│   │   ├── utils/              # Services, interfaces, models
│   │   └── templates/          # Template components
│   └── modules/demo/           # Demo modules (prefix: demo)
│       ├── dashboard/          # Dashboard feature module
│       └── playground/         # Component playground & demos
└── docs/                       # Documentation files
```

## 🌐 Internationalization (i18n)

AUM Core includes comprehensive internationalization support with multiple languages:

### Supported Languages

- **English (en)** - Default language
- **日本語 (ja)** - Japanese
- **हिन्दी (hi)** - Hindi

### Usage

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
    <p>{{ 'WELCOME_SUBTITLE' | translate }}</p>
  `,
})
export class ExampleComponent {}
```

### Language Switching

```typescript
import { LanguageTranslationService } from '@aum/utils';

export class MyComponent {
  private languageService = inject(LanguageTranslationService);

  switchLanguage(lang: 'en' | 'ja' | 'hi') {
    this.languageService.setLanguage(lang);
  }
}
```

### Translation Files

Translation files are located in `libs/aum-core/theme/src/assets/i18n/`:
- `en.json` - English translations
- `ja.json` - Japanese translations
- `hi.json` - Hindi translations

## 🛠️ Technology Stack

- **Angular 21** - Modern framework with standalone components
- **NX 22** - Monorepo tooling and build system
- **Material Design 3** - Consistent theming system
- **TypeScript 5.8** - Type safety and modern JavaScript features
- **RxJS 7.8** - Reactive programming
- **Jest 29** - Testing framework
- **ngx-translate** - Internationalization library

## 📖 Additional Resources

### Learning Resources

- [NX Angular Monorepo Tutorial](https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial)
- [Angular Documentation](https://angular.dev/overview)
- [Angular Material Components](https://material.angular.dev/components/categories)
- [Material Design System](https://material.angular.dev/guide/system-variables)

### Design Resources

- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
- [Google Fonts & Icons](https://fonts.google.com/)
- [Material Design Guidelines](https://material.io/design)

## 🤝 Contributing

1. Read the [Best Practices Guide](./BEST_PRACTICES.md)
2. Understand the [Architecture](./docs/ARCHITECTURE.MD)
3. Follow the development workflow
4. Test your changes in both light and dark modes
5. Submit a pull request with clear description

## 📄 License

MIT License - see LICENSE file for details.

---

**Quick Start:** `npm install && nx serve demo-app`

For detailed information, see our [documentation](#-documentation) above.
