# Dynamic Global Toolbar Actions

The Dynamic Global Toolbar Actions feature allows pages and components to dynamically add/remove action buttons in the global toolbar at runtime.

## 🎮 Live Demo

To see this feature in action, check out the **Playground** page in the demo app:

### Global Actions (Always Visible)
All three are registered in [`global-app-init.service.ts`](../../../../apps/demo-app/src/app/services/global-app-init.service.ts):
- **Feedback** button (icon: `feedback`) - visible in the main toolbar
- **Help** button (icon: `help`) - `overflow: true`, shown in the overflow menu / settings drawer
- **Contact Us** button (icon: `email`) - `overflow: true`, shown in the overflow menu / settings drawer

### Page-Specific Actions (Only on Playground)
- **Create** button (filled style) - Only visible when on `/playground` route
- **Export** button (icon style) - Only visible when on `/playground` route
- These are registered in the Playground component's `ngOnInit()` and removed in `ngOnDestroy()`

**Try it:** Navigate to the Playground page and watch the toolbar buttons appear. Navigate away and see them disappear!

## Features

- ✅ Register/unregister toolbar actions dynamically
- ✅ Actions appear globally in the toolbar
- ✅ Each action has icon, tooltip, type, and callback
- ✅ Actions are sorted by `order` property
- ✅ Overflow actions group into a `more_vert` menu on desktop and into the settings drawer on mobile
- ✅ Page-specific actions can be added/removed on route changes
- ✅ Supports i18n for tooltips and labels

## Usage

### 1. Basic Usage - Register an Action

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ToolbarContentService } from '@aum/templates/aum-template';

@Component({
  selector: 'app-my-page',
  template: `<div>My Page Content</div>`,
})
export class MyPageComponent implements OnInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);

  ngOnInit() {
    this.toolbarContentService.registerGlobalAction(
      { id: 'save', icon: 'save', tooltip: 'SAVE', type: 'icon', order: 1 },
      () => this.save()
    );

    this.toolbarContentService.registerGlobalAction(
      { id: 'download', icon: 'download', tooltip: 'DOWNLOAD', type: 'icon', order: 2 },
      () => this.download()
    );
  }

  ngOnDestroy() {
    this.toolbarContentService.unregisterGlobalAction('save');
    this.toolbarContentService.unregisterGlobalAction('download');
  }

  save() { /* your logic */ }
  download() { /* your logic */ }
}
```

### 2. Button Types

```typescript
// Icon button (default)
{ id: 'edit', icon: 'edit', type: 'icon', tooltip: 'EDIT' }

// Filled button with text
{ id: 'submit', icon: 'check', type: 'filled', value: 'SUBMIT', tooltip: 'SUBMIT_FORM' }

// Outlined button
{ id: 'cancel', icon: 'close', type: 'outlined', value: 'CANCEL', tooltip: 'CANCEL_OPERATION' }

// Basic button
{ id: 'help', icon: 'help', type: 'basic', value: 'HELP', tooltip: 'GET_HELP' }
```

### 3. Overflow Actions

Set `overflow: true` to move an action out of the main toolbar row. On desktop, overflow actions are grouped under a `more_vert` icon button. On mobile (`AumTemplate`), they appear as rows inside the settings drawer.

```typescript
this.toolbarContentService.registerGlobalAction(
  {
    id: 'help',
    icon: 'help',
    tooltip: 'HELP',
    type: 'icon',
    order: 10,
    overflow: true,
  },
  () => this.openHelpDialog()
);
```

Use `overflow: true` for secondary actions (Help, Contact Us, Feedback) that don't need constant visibility in the toolbar.

### 4. Action Ordering

Use the `order` property to control position. Lower numbers appear first.

```typescript
this.toolbarContentService.registerGlobalAction(
  { id: 'primary-action', icon: 'save', order: 1 },
  () => this.save()
);

this.toolbarContentService.registerGlobalAction(
  { id: 'secondary-action', icon: 'refresh', order: 2 },
  () => this.reset()
);
```

### 5. Clear All Actions

```typescript
this.toolbarContentService.clearAllGlobalActions();
```

### 6. Complete Example - Form Page

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarContentService } from '@aum/templates/aum-template';
import { SnackbarService } from '@aum/ui/utilities';

@Component({
  selector: 'app-user-form',
  template: `<form [formGroup]="userForm"><!-- fields --></form>`,
})
export class UserFormComponent implements OnInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  userForm = new FormGroup({ /* controls */ });

  ngOnInit() {
    this.toolbarContentService.registerGlobalAction(
      { id: 'save-user', icon: 'save', tooltip: 'SAVE_USER', type: 'icon', order: 1 },
      () => this.saveUser()
    );
    this.toolbarContentService.registerGlobalAction(
      { id: 'cancel-edit', icon: 'close', tooltip: 'CANCEL', type: 'icon', order: 2 },
      () => this.cancel()
    );
    this.toolbarContentService.registerGlobalAction(
      { id: 'reset-form', icon: 'refresh', tooltip: 'RESET_FORM', type: 'icon', order: 3 },
      () => this.resetForm()
    );
  }

  ngOnDestroy() {
    this.toolbarContentService.unregisterGlobalAction('save-user');
    this.toolbarContentService.unregisterGlobalAction('cancel-edit');
    this.toolbarContentService.unregisterGlobalAction('reset-form');
  }

  saveUser() {
    if (this.userForm.valid) {
      this.snackbarService.success('USER_SAVED_SUCCESSFULLY');
      this.router.navigate(['/users']);
    } else {
      this.snackbarService.error('FORM_VALIDATION_ERROR');
    }
  }

  cancel() { this.router.navigate(['/users']); }
  resetForm() { this.userForm.reset(); this.snackbarService.info('FORM_RESET'); }
}
```

## API Reference

### ToolbarContentService

##### `registerGlobalAction(action: ToolbarAction, callback: () => void): void`
Register a new toolbar action.

##### `unregisterGlobalAction(id: string): void`
Remove a toolbar action by its ID.

##### `getGlobalActions(): Observable<ToolbarAction[]>`
Get an observable of all registered actions, sorted by `order`.

##### `executeAction(id: string): void`
Execute the callback for a specific action.

##### `clearAllGlobalActions(): void`
Remove all registered toolbar actions.

### ToolbarAction Interface

```typescript
interface ToolbarAction {
  id: string;                // Unique identifier for the action
  icon: string;              // Material icon name
  tooltip?: string;          // Translation key for tooltip
  type?: 'outlined' | 'filled' | 'basic' | 'icon';  // Button type
  value?: string;            // Translation key for button text
  order?: number;            // Sort order (lower numbers appear first)
  overflow?: boolean;        // When true, grouped into the overflow menu on desktop and shown in the settings drawer on mobile
}
```

## Best Practices

1. **Always Clean Up**: Unregister actions in `ngOnDestroy` to prevent memory leaks
2. **Use Translation Keys**: Always use translation keys for `tooltip` and `value`. App-level keys go in `apps/{app}/src/assets/i18n/{lang}.json` (flat, e.g. `'SAVE'`). Core library keys use the `AUM.*` namespace (e.g. `'AUM.MENU'`) and must not be redefined in app files
3. **Unique IDs**: Use descriptive, unique IDs (e.g., `'save-user'`, not `'save'`)
4. **Logical Ordering**: Use the `order` property to group related actions
5. **Icon Buttons**: Prefer `type: 'icon'` for toolbar actions to save space
6. **Overflow for Secondary Actions**: Use `overflow: true` for Help, Feedback, Contact Us

## Event Bus Integration

The toolbar emits application-wide events via `AppEventBusService` for preference changes and logout. Listen to these anywhere in the app:

```typescript
import { AppEventBusService, AppEventType } from '@aum/templates/aum-template';

export class MyComponent {
  private eventBus = inject(AppEventBusService);

  ngOnInit() {
    this.eventBus.on(AppEventType.LOGOUT).subscribe(() => {
      // Handle logout — clear state, redirect, etc.
    });

    this.eventBus.on(AppEventType.THEME_CHANGED).subscribe((payload) => {
      // payload: { theme, previousTheme }
    });
  }
}
```

### Available Event Types

| Event Type | Payload | Description |
|---|---|---|
| `LOGOUT` | — | Emitted when the user logs out |
| `THEME_CHANGED` | `{ theme, previousTheme }` | Emitted when the user switches light/dark/system theme |
| `UI_SCALE_CHANGED` | `{ scale, previousScale }` | Emitted when the user changes display density (compact/default/large) |
| `LANGUAGE_CHANGED` | `{ language, previousLanguage }` | Emitted when the user switches the app language |
| `TEMPLATE_CHANGED` | `{ template: 'template-1' \| 'template-2' }` | Emitted when the user switches between layout templates |

## Examples from AUM Core

- `apps/demo-app/src/app/services/global-app-init.service.ts` — All global actions (Feedback, Help, Contact Us)
- `libs/modules/demo/playground/src/lib/playground/playground.ts` — Page-specific actions
- `libs/aum-core/templates/aum-template/src/lib/components/toolbar/toolbar.component.ts` — Toolbar integration
