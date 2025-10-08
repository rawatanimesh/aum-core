# Contributing to AUM UI

Thank you for your interest in contributing to AUM UI! This guide will help you get started with contributing to our Angular component library.

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🛠️ Development Setup](#️-development-setup)
- [🔄 Contribution Workflow](#-contribution-workflow)
- [🧩 Component Development](#-component-development)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [📚 Documentation](#-documentation)
- [👀 Code Review Process](#-code-review-process)
- [🚨 Common Issues & Solutions](#-common-issues--solutions)
- [📞 Getting Help](#-getting-help)
- [🎯 Contribution Types](#-contribution-types)
- [📜 Code of Conduct](#-code-of-conduct)

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js**: v22.17.0
- **npm**: Latest version
- **Git**: Latest version
- **Angular CLI**: v20.x
- **NX CLI**: v21.x (recommended)

### Project Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:

```bash
git clone https://github.com/your-username/aum-core.git
cd aum-core
```

3. **Add upstream remote**:

```bash
git remote add upstream https://github.com/original-owner/aum-core.git
```

4. **Install dependencies**:

```bash
npm install
```

5. **Start development server**:

```bash
nx serve aum-core
```

---

## 🛠️ Development Setup

### Environment Configuration

Create a `.env` file in the root directory (if needed):

```bash
# Development environment variables
NODE_ENV=development
```

### IDE Setup

**Recommended VS Code Extensions:**

- Angular Language Service
- TypeScript Hero
- Prettier
- ESLint
- Angular Snippets
- Material Icon Theme

**VS Code Settings (.vscode/settings.json):**

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  }
}
```

---

## 🔄 Contribution Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/component-name
# or
git checkout -b bugfix/issue-description
```

### 2. Make Your Changes

- Follow the [Best Practices Guide](./BEST_PRACTICES.md)
- Write clean, documented code
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Your Changes

Use conventional commit format:

```bash
git add .
git commit -m "feat: add new button component with icon support"
```

**Commit Message Format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no functional changes)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/component-name
```

Create a pull request on GitHub with:

- Clear description of changes
- Screenshots (for UI changes)
- Link to related issues
- Testing instructions

---

## 🧩 Component Development

### Creating a New Component

1. **Generate component using NX**:

```bash
nx g @nx/angular:component my-component --project=ui --standalone
```

2. **Component structure**:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aum-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss',
})
export class MyComponent {
  @Input() property: string = '';
  @Output() actionEvent = new EventEmitter<string>();

  handleAction(): void {
    this.actionEvent.emit(this.property);
  }
}
```

3. **Add to public API**:

```typescript
// libs/aum/ui/src/index.ts
export * from './lib/my-component/my-component';
```

### Component Checklist

- [ ] Follows standalone component pattern
- [ ] **CRITICAL: Uses Material Design system variables for ALL colors (no hardcoded colors)**
- [ ] **CRITICAL: Uses rem() function for ALL dimensions (no px values)**
- [ ] **CRITICAL: Tested in all UI scales (Compact/Default/Large modes)**
- [ ] **CRITICAL: Perfect light and dark mode support**
- [ ] Implements proper TypeScript typing
- [ ] Includes accessibility attributes
- [ ] Has comprehensive tests
- [ ] Is responsive across device sizes
- [ ] Has proper documentation

### ⚠️ UI Development Critical Requirements

Before creating any UI component, ensure you understand:

#### 1. Theming Requirements

```scss
// ✅ REQUIRED: Always use Material system variables
.my-component {
  color: var(--mat-sys-on-surface);
  background-color: var(--mat-sys-surface);
  border: 1px solid var(--mat-sys-outline-variant);
}

// ❌ FORBIDDEN: Never use hardcoded colors
.my-component {
  color: #333; // Breaks dark mode
  background-color: #fff; // Not theme-aware
}
```

#### 2. Scalable Dimensions

```scss
// ✅ REQUIRED: Use rem() function for all dimensions
.my-component {
  padding: rem(16); // Scales with user preference
  font-size: rem(14); // Adapts to display mode
  min-height: rem(44); // Proper touch targets
}

// ❌ FORBIDDEN: Don't use pixel values
.my-component {
  padding: 16px; // Fixed, not scalable
  font-size: 14px; // Breaks UI scaling
}
```

#### 3. Display Mode Testing

Every component must be tested in:

- **Compact Mode**: Smaller, denser UI
- **Default Mode**: Standard comfortable sizing
- **Large Mode**: Bigger, more accessible UI

---

## 🧪 Testing Guidelines

### Unit Tests

Create comprehensive unit tests:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on action', () => {
    spyOn(component.actionEvent, 'emit');
    component.handleAction();
    expect(component.actionEvent.emit).toHaveBeenCalledWith(component.property);
  });
});
```

### Running Tests

```bash
# Run unit tests
nx test ui

# Run tests with coverage
nx test ui --coverage

# Run tests in watch mode
nx test ui --watch
```

### Integration Testing

Test component integration in the playground:

1. Add component to playground
2. Test different configurations
3. Verify accessibility
4. Check responsive behavior

---

## 📚 Documentation

### Component Documentation

Document your component with JSDoc:

````typescript
/**
* A reusable button component with multiple variants
*
* @example
* ```html
* <aum-button
*   type="filled"
*   (buttonClick)="handleClick()">
*   Click me
* </aum-button>
* ```
*/
@Component({...})
export class ButtonComponent {
 /**
  * The visual style of the button
  * @default 'filled'
  */
 @Input() type: 'filled' | 'outlined' = 'filled';
}
````

### README Updates

Update relevant README files when:

- Adding new components
- Changing APIs
- Adding new features
- Updating dependencies

---

## 👀 Code Review Process

### Before Submitting

Run the following checks:

```bash
# Lint code
nx lint aum-core

# Run tests
nx test aum-core

# Build project
nx build aum-core --configuration=production

# Check formatting
npm run prettier:check
```

### Pull Request Requirements

✅ **Required for approval:**

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] **CRITICAL: All colors use Material system variables**
- [ ] **CRITICAL: All dimensions use rem() function**
- [ ] **CRITICAL: Component works in Compact/Default/Large modes**
- [ ] **CRITICAL: Perfect light AND dark mode compatibility**
- [ ] Responsive design verified
- [ ] Accessibility tested

### UI Development Review Criteria

**Mandatory Checks:**

- [ ] ✅ Zero hardcoded color values (#hex, rgb, rgba)
- [ ] ✅ Zero pixel (px) dimension values
- [ ] ✅ All colors reference var(--mat-sys-\*) variables
- [ ] ✅ All dimensions use rem() function
- [ ] ✅ Theme switching works flawlessly
- [ ] ✅ UI scaling works in all three display modes
- [ ] ✅ Hover/focus/disabled states use theme variables
- [ ] ✅ Component maintains proportions across scale modes

### Review Criteria

**Code Quality:**

- Clean, readable code
- Proper TypeScript usage
- Following established patterns
- No code duplication

**Functionality:**

- Feature works as intended
- Edge cases handled
- Error states considered
- Performance optimized

**Design:**

- Consistent with design system
- Proper spacing and typography
- Responsive behavior
- Accessibility compliant

---

## 🚨 Common Issues & Solutions

### Build Errors

**Issue:** Module not found errors

```
Solution: Check import paths and ensure exports are added to index.ts
```

**Issue:** Type errors in templates

```
Solution: Verify component properties and their types
```

### Styling Issues

**Issue:** Styles not applying

```
Solution: Check CSS specificity and component encapsulation
```

**Issue:** Theme variables not working

```
Solution: Ensure theme is properly imported and CSS variables are used
```

### Testing Issues

**Issue:** Tests failing after component changes

```
Solution: Update test expectations and mock dependencies
```

---

## 📞 Getting Help

If you need help with your contribution:

1. **Check documentation** - Review our guides and best practices
2. **Search issues** - Look for existing issues and solutions
3. **Ask questions** - Create a discussion or issue for guidance
4. **Join community** - Participate in project discussions

---

## 🎯 Contribution Types

We welcome various types of contributions:

### Code Contributions

- New components
- Bug fixes
- Performance improvements
- Refactoring

### Documentation

- API documentation
- Usage examples
- Tutorials
- Best practices

### Design

- UI/UX improvements
- Accessibility enhancements
- Responsive design fixes

### Testing

- Unit tests
- Integration tests
- Accessibility tests
- Performance tests

---

## 📜 Code of Conduct

Please note that this project follows a Code of Conduct. By participating, you agree to abide by its terms:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Collaborate effectively

---

Thank you for contributing to AUM UI! Your efforts help make this library better for everyone. 🚀
