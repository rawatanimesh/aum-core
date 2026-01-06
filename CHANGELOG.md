# Changelog

All notable changes to the AUM UI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Internationalization (i18n)**: Full multi-language support with English, Japanese (日本語), and Hindi (हिन्दी) translations
- **LanguageTranslationService**: Signal-based reactive language switching with localStorage persistence
- **DrawerComponent**: Side panel component integrated with page component for additional content
- **SpinnerComponent**: Loading indicators with page mode (full screen overlay) and element mode (inline spinners)
- **Global Error Handling**: Structured error logging with HTTP error interceptor
- **ApplicationConfigService**: Centralized configuration management for navigation and settings
- **Page Not Found Component**: 404 error page with proper routing fallback
- Comprehensive documentation system with best practices and architecture guides
- Enhanced dashboard component with welcome section, component showcase, and feature roadmap
- Revamped playground component with organized tabbed interface
- Theme-based styling system using Material Design 3 variables

### Changed

- **Upgraded to Angular 21**: Migrated entire codebase to latest Angular version with enhanced features
- **Upgraded to NX 22.3.3**: Updated monorepo tooling for better performance
- **Dashboard Redesign**: Clean welcome message layout with proper SCSS using rem() function
- **Toolbar Enhancement**: Language selection dropdown with readable language options (English, 日本語, हिन्दी)
- **Sidenav Translation**: All navigation items now support multi-language translation
- **Breadcrumb Service**: Moved service and interface for better modularity
- Updated dashboard to use card-based layout with proper content projection
- Restructured playground with better component categorization and responsive design
- Improved project documentation with detailed setup and development guides

### Fixed

- **Toolbar Menu Translation Lag**: Fixed critical issue where menu items weren't translating on first language toggle by reordering event handler operations
- Attempted route navigation not working on login
- Card component content projection issues
- TypeScript type errors in playground component
- Theme color consistency across all components
- Scoped style rules in select-box component

## [0.1.0] - 2024-10-08

### Added

- Initial project setup with NX monorepo architecture
- Core Angular 20 application with Material Design 3 theming
- Base component library structure in `libs/aum/ui`
- Essential UI components:
- ButtonComponent with multiple variants (filled, outlined, basic, icon)
- CardComponent with configurable padding and shadow
- PageComponent with breadcrumb navigation
- InputComponent with validation support
- CheckboxComponent with indeterminate state
- RadioButtonComponent with group selection
- DatePickerComponent with calendar interface
- SelectBoxComponent with single/multiple selection
- AutocompleteComponent with dynamic suggestions
- ConfirmationDialogComponent for user confirmations
- GenericDialogComponent for custom modals
- SnackbarService for toast notifications
- MenuListComponent with nested menu support
- BreadcrumbComponent for navigation
- SideMenuComponent for navigation sidebar

### Technical Implementation

- Standalone component architecture
- Signal-based state management
- Material Design 3 theme system with CSS custom properties
- Responsive design with mobile-first approach
- Comprehensive TypeScript typing
- Jest-based testing framework
- ESLint and Prettier for code quality

### Project Structure

```
aum-core/
├── apps/aum-core/          # Main application
├── libs/
│   ├── aum/                # Core AUM libraries
│   │   ├── ui/             # UI component library
│   │   ├── theme/          # Theming and styling
│   │   ├── utils/          # Utilities and services
│   │   └── templates/      # Template components
│   └── modules/            # Application modules
│       ├── dashboard/      # Dashboard feature
│       └── playground/     # Component showcase
```

### Theme System

- Purple-based Material Design 3 theme
- Light/dark mode support
- Consistent color palette across components
- CSS custom properties for theme variables

### Development Tools

- NX 21.x for monorepo management
- Angular CLI 20.x for development
- TypeScript 5.8.x for type safety
- Jest for unit testing
- ESLint for code linting
- Prettier for code formatting

---

## Changelog Guidelines

### Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Format

- **Major** (X.0.0) - Breaking changes
- **Minor** (0.X.0) - New features, backward compatible
- **Patch** (0.0.X) - Bug fixes, backward compatible

### Entry Format

```markdown
## [Version] - YYYY-MM-DD

### Added

- Feature description with context

### Changed

- Change description with reason

### Fixed

- Bug fix description with impact
```

---

_This changelog is maintained manually and updated with each release._
