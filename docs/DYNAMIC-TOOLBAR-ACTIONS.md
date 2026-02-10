# Dynamic Global Toolbar Actions

The Dynamic Global Toolbar Actions feature allows pages and components to dynamically add/remove action buttons in the global toolbar at runtime.

## 🎮 Live Demo

To see this feature in action, check out the **Playground** page in the demo app:

### Global Actions (Always Visible)
- **Help** button (icon: `help_outline`) - Available on all pages
- **Feedback** button (icon: `feedback`) - Available on all pages
- These are registered in [`global-app-init.service.ts`](../../../../apps/aum-core/src/app/services/global-app-init.service.ts)

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
    // Register a save action
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'save',
        icon: 'save',
        tooltip: 'SAVE', // Translation key
        type: 'icon',
        order: 1,
      },
      () => this.save()
    );

    // Register a download action
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'download',
        icon: 'download',
        tooltip: 'DOWNLOAD',
        type: 'icon',
        order: 2,
      },
      () => this.download()
    );
  }

  ngOnDestroy() {
    // Clean up actions when component is destroyed
    this.toolbarContentService.unregisterGlobalAction('save');
    this.toolbarContentService.unregisterGlobalAction('download');
  }

  save() {
    console.log('Save action clicked');
    // Your save logic here
  }

  download() {
    console.log('Download action clicked');
    // Your download logic here
  }
}
```

### 2. Button Types

The `type` property supports different Material Design button styles:

```typescript
// Icon button (default)
{
  id: 'edit',
  icon: 'edit',
  type: 'icon',
  tooltip: 'EDIT'
}

// Filled button with text
{
  id: 'submit',
  icon: 'check',
  type: 'filled',
  value: 'SUBMIT', // Button text
  tooltip: 'SUBMIT_FORM'
}

// Outlined button
{
  id: 'cancel',
  icon: 'close',
  type: 'outlined',
  value: 'CANCEL',
  tooltip: 'CANCEL_OPERATION'
}

// Basic button
{
  id: 'help',
  icon: 'help',
  type: 'basic',
  value: 'HELP',
  tooltip: 'GET_HELP'
}
```

### 3. Action Ordering

Use the `order` property to control the position of actions:

```typescript
this.toolbarContentService.registerGlobalAction(
  {
    id: 'first',
    icon: 'first_page',
    order: 1, // Appears first
  },
  () => this.first()
);

this.toolbarContentService.registerGlobalAction(
  {
    id: 'second',
    icon: 'arrow_forward',
    order: 2, // Appears second
  },
  () => this.second()
);
```

### 4. Clear All Actions

```typescript
// Remove all registered actions
this.toolbarContentService.clearAllGlobalActions();
```

### 5. Complete Example - Form Page

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarContentService, AppEventBusService, AppEventType } from '@aum/templates/aum-template';
import { SnackbarService } from '@aum/ui/utilities';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm">
      <!-- Form fields here -->
    </form>
  `,
})
export class UserFormComponent implements OnInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private snackbarService = inject(SnackbarService);
  private eventBus = inject(AppEventBusService);
  private router = inject(Router);

  userForm = new FormGroup({
    // Form controls
  });

  ngOnInit() {
    // Register Save action
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'save-user',
        icon: 'save',
        tooltip: 'SAVE_USER',
        type: 'icon',
        order: 1,
      },
      () => this.saveUser()
    );

    // Register Cancel action
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'cancel-edit',
        icon: 'close',
        tooltip: 'CANCEL',
        type: 'icon',
        order: 2,
      },
      () => this.cancel()
    );

    // Register Reset action
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'reset-form',
        icon: 'refresh',
        tooltip: 'RESET_FORM',
        type: 'icon',
        order: 3,
      },
      () => this.resetForm()
    );
  }

  ngOnDestroy() {
    // Clean up all actions
    this.toolbarContentService.unregisterGlobalAction('save-user');
    this.toolbarContentService.unregisterGlobalAction('cancel-edit');
    this.toolbarContentService.unregisterGlobalAction('reset-form');
  }

  saveUser() {
    if (this.userForm.valid) {
      // Save logic
      this.snackbarService.success('USER_SAVED_SUCCESSFULLY');
      this.router.navigate(['/users']);
    } else {
      this.snackbarService.error('FORM_VALIDATION_ERROR');
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  resetForm() {
    this.userForm.reset();
    this.snackbarService.info('FORM_RESET');
  }
}
```

## API Reference

### ToolbarContentService

#### Methods

##### `registerGlobalAction(action: ToolbarAction, callback: () => void): void`
Register a new toolbar action.

**Parameters:**
- `action`: The action configuration
- `callback`: Function to execute when the action is clicked

##### `unregisterGlobalAction(id: string): void`
Remove a toolbar action by its ID.

**Parameters:**
- `id`: The unique identifier of the action to remove

##### `getGlobalActions(): Observable<ToolbarAction[]>`
Get an observable of all registered actions (sorted by order).

**Returns:** Observable that emits the current list of actions

##### `executeAction(id: string): void`
Execute the callback for a specific action.

**Parameters:**
- `id`: The unique identifier of the action

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
}
```

## Best Practices

1. **Always Clean Up**: Unregister actions in `ngOnDestroy` to prevent memory leaks
2. **Use Translation Keys**: Always use translation keys for `tooltip` and `value`
3. **Unique IDs**: Use descriptive, unique IDs for actions (e.g., 'save-user', not 'save')
4. **Logical Ordering**: Use the `order` property to group related actions
5. **Icon Buttons**: Prefer `type: 'icon'` for toolbar actions to save space
6. **Consistent Naming**: Use consistent naming conventions across your app

## Event Bus Integration

The toolbar also integrates with the `AppEventBusService` for application-wide events:

```typescript
import { AppEventBusService, AppEventType } from '@aum/templates/aum-template';

export class MyComponent {
  private eventBus = inject(AppEventBusService);

  ngOnInit() {
    // Listen to logout events
    this.eventBus.on(AppEventType.LOGOUT).subscribe(() => {
      console.log('User logged out');
      // Handle logout
    });
  }

  logout() {
    // Emit logout event
    this.eventBus.emit(AppEventType.LOGOUT);
  }
}
```

## Examples from PLM Core

For more examples, refer to the PLM Core implementation:
- `libs/modules/playground/playground.component.ts` - Demonstration of page-specific actions
- `libs/plm-core/app-template/src/lib/components/toolbar/toolbar.component.ts` - Toolbar integration
