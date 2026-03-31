# Custom Toolbar Menu - Usage Guide

This guide explains how to add custom menu dropdowns to the application toolbar using template references and event bus integration.

## Features

- ✅ **Template-Based**: Use Angular's `ng-template` and `@ViewChild` for maximum flexibility
- ✅ **Custom HTML**: Add any HTML structure (icons, buttons, badges, custom styling)
- ✅ **Event Bus Integration**: Decoupled communication between toolbar and components
- ✅ **Multiple Menus**: Support for multiple custom menus simultaneously
- ✅ **Custom Positioning**: Control display order with `order` property
- ✅ **Simple Registration**: Service-based registration similar to `registerGlobalAction`
- ✅ **Type Safe**: Full TypeScript support with interfaces
- ✅ **Dialog Integration**: Easy integration with Material dialogs for follow-up actions
- ✅ **i18n Support**: Full translation support with @ngx-translate

## Architecture Overview

The toolbar custom menu system uses a **template registration pattern**:

1. **Define template** in your component using `ng-template` with `#templateName`
2. **Get template reference** using `@ViewChild('templateName')`
3. **Register template** with `ToolbarContentService.registerCustomTemplate()`
4. **Toolbar renders** the template in the correct position

## API Reference

### ToolbarCustomTemplate Interface

```typescript
interface ToolbarCustomTemplate {
  id: string;                      // Unique identifier (required)
  template: TemplateRef<unknown>;  // Angular template reference (required)
  order?: number;                  // Display order (default: 0, lower numbers appear first)
}
```

### MenuItem Interface

```typescript
interface MenuItem {
  label: string;                 // Menu item label (translation key)
  value?: string;                // Unique value/ID for the menu item
  icon?: string;                 // Optional icon name (Material Icons)
  disabled?: boolean;            // Disabled state (default: false)
  selected?: boolean;            // Selection state (default: false)
  showSelection?: boolean;       // Show selection indicator (default: false)
  children?: MenuItem[];         // Nested submenu items (optional)
}
```

### CustomMenuActionPayload Interface

```typescript
interface CustomMenuActionPayload {
  menuId: string;                // ID of the custom menu that triggered this
  actionId: string;              // ID/value of the menu item clicked
  data?: unknown;                // Optional additional data (full MenuItem or custom data)
}
```

### AppEventType Enum

```typescript
enum AppEventType {
  LOGOUT = 'LOGOUT',
  CUSTOM_MENU_ACTION = 'CUSTOM_MENU_ACTION',
  THEME_CHANGED = 'THEME_CHANGED',
  UI_SCALE_CHANGED = 'UI_SCALE_CHANGED',
  LANGUAGE_CHANGED = 'LANGUAGE_CHANGED',
  TEMPLATE_CHANGED = 'TEMPLATE_CHANGED',
}
```

| Event | Payload | Emitted when |
|---|---|---|
| `LOGOUT` | — | User logs out |
| `CUSTOM_MENU_ACTION` | `{ menuId, actionId, data }` | Custom toolbar menu item is selected |
| `THEME_CHANGED` | `{ theme, previousTheme }` | User switches light/dark/system theme |
| `UI_SCALE_CHANGED` | `{ scale, previousScale }` | User changes display density (compact/default/large) |
| `LANGUAGE_CHANGED` | `{ language, previousLanguage }` | User switches app language |
| `TEMPLATE_CHANGED` | `{ template: 'template-1' \| 'template-2' }` | User switches layout template |

### ToolbarContentService Methods

```typescript
// Register a custom template
registerCustomTemplate(template: ToolbarCustomTemplate): void

// Unregister a template by ID
unregisterCustomTemplate(id: string): void

// Get observable of all custom templates
getCustomTemplates(): Observable<ToolbarCustomTemplate[]>

// Clear all custom templates
clearAllCustomTemplates(): void
```

### AppEventBusService Methods

```typescript
// Emit an event
emit<T>(type: AppEventType, payload?: T): void

// Listen to specific event type
on<T>(eventType: AppEventType): Observable<T | undefined>

// Listen to all events
onAll(): Observable<AppEvent>
```

## Usage Examples

### Example 1: Simple 3-Dot Menu with Actions

**app.ts:**
```typescript
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import {
  ToolbarContentService,
  AppEventBusService,
  AppEventType,
  CustomMenuActionPayload,
} from '@aum/templates/aum-template';
import { ButtonComponent } from '@aum/ui/buttons';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { HelpDialog, ContactUsDialog } from '@demo/playground';

@Component({
  imports: [RouterModule, MatMenuModule, ButtonComponent, MenuList, TranslateModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private eventBus = inject(AppEventBusService);
  private dialog = inject(MatDialog);

  // ViewChild for the custom toolbar menu template
  @ViewChild('moreOptionsMenu') moreOptionsMenuTemplate!: TemplateRef<unknown>;

  // Menu items for the 3-dot menu - using translation keys directly
  moreOptionsMenuItems: MenuItem[] = [
    {
      label: 'HELP',
      value: 'help',
      icon: 'help',
      showSelection: false,
    },
    {
      label: 'CONTACT_US',
      value: 'contact',
      icon: 'email',
      showSelection: false,
    },
  ];

  ngOnInit(): void {
    // Subscribe to custom menu events
    this.eventBus
      .on<CustomMenuActionPayload>(AppEventType.CUSTOM_MENU_ACTION)
      .subscribe((payload) => {
        if (!payload) return;
        console.log('Menu action received:', payload);
      });
  }

  ngAfterViewInit(): void {
    // Register the custom toolbar menu template after view is initialized
    if (this.moreOptionsMenuTemplate) {
      this.toolbarContentService.registerCustomTemplate({
        id: 'more-options-menu',
        template: this.moreOptionsMenuTemplate,
        order: 10, // Position between global actions and preferences
      });
    }
  }

  onMoreOptionsSelect(item: MenuItem): void {
    console.log('🎯 More options menu item selected:', item);

    // Emit event via event bus for global handling
    const payload: CustomMenuActionPayload = {
      menuId: 'more-options-menu',
      actionId: item.value || '',
      data: item,
    };
    this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, payload);

    // Handle specific actions
    switch (item.value) {
      case 'help':
        console.log('ℹ️ Opening help dialog...');
        this.openHelpDialog();

        // Emit global event via event bus so other components can react
        this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
          menuId: 'help-dialog',
          actionId: 'help-opened',
          data: {
            dialogType: 'help',
            timestamp: new Date().toISOString(),
          },
        });
        break;

      case 'contact':
        console.log('📧 Opening contact us dialog...');
        this.openContactUsDialog();

        // Emit global event via event bus so other components can react
        this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
          menuId: 'contact-dialog',
          actionId: 'contact-opened',
          data: {
            dialogType: 'contact',
            timestamp: new Date().toISOString(),
          },
        });
        break;
    }
  }

  private openHelpDialog(): void {
    this.dialog.open(HelpDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  private openContactUsDialog(): void {
    this.dialog.open(ContactUsDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.toolbarContentService.unregisterCustomTemplate('more-options-menu');
  }
}
```

**app.html:**
```html
<!-- Custom toolbar menu template -->
<ng-template #moreOptionsMenu>
  <aum-button
    [type]="'icon'"
    [icon]="'more_vert'"
    [tooltip]="'MORE_OPTIONS' | translate"
    [matMenuTriggerFor]="moreMenu.childMenu"
  ></aum-button>

  <aum-menu-list
    #moreMenu="aumMenu"
    [list]="moreOptionsMenuItems"
    (itemSelected)="onMoreOptionsSelect($event)"
  ></aum-menu-list>
</ng-template>

<router-outlet></router-outlet>
```

### Example 2: Multiple Custom Menus

```typescript
export class AdminDashboard implements AfterViewInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private eventBus = inject(AppEventBusService);

  @ViewChild('adminActionsMenu') adminActionsTemplate!: TemplateRef<unknown>;
  @ViewChild('reportsMenu') reportsTemplate!: TemplateRef<unknown>;

  adminMenuItems: MenuItem[] = [
    { label: 'USER_MANAGEMENT', value: 'users', icon: 'people', showSelection: false },
    { label: 'SYSTEM_SETTINGS', value: 'system', icon: 'settings', showSelection: false },
  ];

  reportsMenuItems: MenuItem[] = [
    { label: 'EXPORT_CSV', value: 'export-csv', icon: 'file_download', showSelection: false },
    { label: 'EXPORT_PDF', value: 'export-pdf', icon: 'picture_as_pdf', showSelection: false },
  ];

  ngAfterViewInit(): void {
    // Register admin actions menu (appears first)
    this.toolbarContentService.registerCustomTemplate({
      id: 'admin-actions',
      template: this.adminActionsTemplate,
      order: 5,
    });

    // Register reports menu (appears second)
    this.toolbarContentService.registerCustomTemplate({
      id: 'reports',
      template: this.reportsTemplate,
      order: 10,
    });
  }

  onAdminActionSelect(item: MenuItem): void {
    this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
      menuId: 'admin-actions',
      actionId: item.value || '',
      data: item,
    });
    // Handle action...
  }

  onReportActionSelect(item: MenuItem): void {
    this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
      menuId: 'reports',
      actionId: item.value || '',
      data: item,
    });
    // Handle action...
  }

  ngOnDestroy(): void {
    this.toolbarContentService.unregisterCustomTemplate('admin-actions');
    this.toolbarContentService.unregisterCustomTemplate('reports');
  }
}
```

## Global Event Handling

You can listen to custom menu events globally in a service or component:

```typescript
import { Injectable, inject } from '@angular/core';
import { AppEventBusService, AppEventType, CustomMenuActionPayload } from '@aum/templates/aum-template';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GlobalAppService {
  private eventBus = inject(AppEventBusService);

  constructor() {
    this.subscribeToCustomMenuEvents();
  }

  private subscribeToCustomMenuEvents(): void {
    this.eventBus.on<CustomMenuActionPayload>(AppEventType.CUSTOM_MENU_ACTION)
      .subscribe((payload) => {
        if (!payload) return;

        console.log('Global event received from custom menu:', payload);
        console.log('   Menu ID:', payload.menuId);
        console.log('   Action ID:', payload.actionId);
        console.log('   Data:', payload.data);

        // Handle specific events
        if (payload.menuId === 'help-dialog' && payload.actionId === 'help-opened') {
          console.log('Help dialog was opened');
          // Track analytics, update state, etc.
        }
      });
  }
}
```

## Creating Reusable Dialog Components

**help-dialog/help-dialog.ts:**
```typescript
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'demo-help-dialog',
  imports: [GenericDialogComponent, ButtonComponent, TranslateModule],
  templateUrl: './help-dialog.html',
  styleUrl: './help-dialog.scss',
})
export class HelpDialog {
  private readonly dialogRef = inject(MatDialogRef<HelpDialog>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
```

**help-dialog/help-dialog.html:**
```html
<aum-generic-dialog [showCloseButton]="true">
  <div dialog-header>
    <span>{{ 'HELP_TITLE' | translate }}</span>
  </div>

  <div dialog-body>
    <p class="dialog-message">{{ 'HELP_MESSAGE' | translate }}</p>
  </div>

  <div dialog-footer>
    <div class="dialog-actions">
      <aum-button
        [type]="'filled'"
        [value]="'CLOSE' | translate"
        (clickButton)="closeDialog()"
      ></aum-button>
    </div>
  </div>
</aum-generic-dialog>
```

**help-dialog/help-dialog.scss:**
```scss
@use 'functions' as *;

.dialog-message {
  margin: 0;
  line-height: 1.6;
  color: var(--mat-sys-on-surface-variant);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: rem(8);
}
```

## Best Practices

1. **Always use `ngAfterViewInit`**: Register templates in `ngAfterViewInit` (not `ngOnInit`) to ensure `@ViewChild` is initialized
2. **Clean up in `ngOnDestroy`**: Always unregister templates when component is destroyed
3. **Use translation keys**: Always use `UPPER_CASE_SNAKE_CASE` translation keys for menu labels, never hardcoded strings
4. **Action items need `showSelection: false`**: For menu items that trigger actions (not state toggles), set `showSelection: false`
5. **Use semantic IDs**: Use descriptive IDs like `'help-dialog'` not `'dialog1'`
6. **Order matters**: Lower order numbers appear first (e.g., order: 5 appears before order: 10)
7. **Use event bus for decoupling**: Emit events instead of directly calling other components
8. **Check template existence**: Always check `if (this.templateRef)` before registering
9. **Unique template names**: Use unique `#templateName` to avoid conflicts
10. **Import required modules**: Don't forget `MatMenuModule`, `ButtonComponent`, `MenuList`, and `TranslateModule`
11. **Follow BEST_PRACTICES.md**: Use Material Design system variables and rem() function for all styling

## Menu Positioning

Custom menus appear in the toolbar in this order:

```
[Logo] [Menu] [Breadcrumb]  |  [Global Actions] [Custom Templates (order: 1-100)] [Preferences] [Profile]
```

**Example ordering:**
```typescript
{ id: 'admin', order: 5 }          // Appears first
{ id: 'notifications', order: 8 }  // Appears second
{ id: 'more-options', order: 10 }  // Appears third
{ id: 'reports', order: 15 }       // Appears fourth
```

## Translation Keys

Always add translation keys to all language files:

**en.json:**
```json
{
  "HELP": "Help",
  "CONTACT_US": "Contact Us",
  "MORE_OPTIONS": "More Options",
  "HELP_TITLE": "Help & Documentation",
  "HELP_MESSAGE": "Welcome to AUM - Angular UI Mods!...",
  "CONTACT_US_TITLE": "Contact Us",
  "CONTACT_US_MESSAGE": "Need help or have questions?..."
}
```

**ja.json:**
```json
{
  "HELP": "ヘルプ",
  "CONTACT_US": "お問い合わせ",
  "MORE_OPTIONS": "その他のオプション"
}
```

**hi.json:**
```json
{
  "HELP": "मदद",
  "CONTACT_US": "हमसे संपर्क करें",
  "MORE_OPTIONS": "अधिक विकल्प"
}
```

## Architecture

```
libs/aum/templates/aum-template/
├── services/
│   ├── toolbar-content.service.ts   (Template registration service)
│   └── app-event-bus.service.ts     (Event communication)
└── components/
    └── toolbar/
        ├── toolbar.component.ts      (Subscribes to templates)
        └── toolbar.component.html    (Renders templates with @for loop)

apps/demo-app/
└── app/
    ├── app.ts                        (Registers templates via ViewChild)
    └── app.html                      (Defines ng-template)

libs/modules/demo/common/
└── src/
    └── lib/
        └── dialogs/
            ├── help-dialog/          (Reusable dialog component)
            └── contact-us-dialog/    (Reusable dialog component)
```

## Communication Flow

```
Component defines ng-template
    ↓
@ViewChild gets TemplateRef
    ↓
ngAfterViewInit → registerCustomTemplate()
    ↓
ToolbarContentService stores template
    ↓
ToolbarComponent subscribes to getCustomTemplates()
    ↓
Toolbar renders template with *ngTemplateOutlet
    ↓
User clicks menu item
    ↓
Component emits event via EventBus (twice: generic + specific)
    ↓
Other components listen and react
```

## Key Advantages

- **Maximum Flexibility**: Any HTML structure, not limited to config objects
- **Simple Registration**: Similar pattern to `registerGlobalAction`
- **No Wrapper Components**: Templates live in your component, no extra files needed
- **Full Control**: Complete control over HTML, styling, and behavior
- **Standard Angular**: Uses `ng-template`, `@ViewChild`, and services - familiar patterns
- **Easy Testing**: Test your component with templates like any other component
- **Decoupled Architecture**: Components communicate via event bus without direct dependencies
- **Full i18n Support**: All text automatically translates based on user's language preference

## Notes

- Templates are registered **per component** and should be unregistered when component is destroyed
- Multiple components can register templates simultaneously
- The toolbar automatically sorts templates by `order` property
- Event bus enables decoupled communication between components
- Compatible with Angular Material dialogs and all Material components
- **Always use translation keys** (UPPER_CASE_SNAKE_CASE) for all user-facing text
- **Use global events** for cross-component communication (dialog opens, filters, etc.)
- **Follow BEST_PRACTICES.md** for all styling (Material Design variables, rem() function)

---

_For more information, see [BEST_PRACTICES.md](../BEST_PRACTICES.md)_
