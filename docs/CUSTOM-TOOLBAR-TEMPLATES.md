# Custom Toolbar Templates - Usage Guide

This guide explains how to add custom UI templates to the application toolbar using `ToolbarContentService`.

## Overview

Custom toolbar templates let you inject any Angular template (buttons, badges, dropdowns, etc.) into the toolbar at a specific position. This is useful when you need custom UI that goes beyond standard icon/filled action buttons.

## Architecture

The system uses a **template registration pattern**:

1. **Define template** in your component using `ng-template` with `#templateName`
2. **Get template reference** using `@ViewChild('templateName')`
3. **Register template** with `ToolbarContentService.registerCustomTemplate()` in `ngAfterViewInit`
4. **Toolbar renders** the template in the correct position
5. **Unregister** in `ngOnDestroy`

> For simple actions (icon buttons, filled buttons), prefer `registerGlobalAction` from [DYNAMIC-TOOLBAR-ACTIONS.md](./DYNAMIC-TOOLBAR-ACTIONS.md). Use custom templates only when you need custom HTML — e.g. a menu dropdown with a badge count.

---

## API Reference

### ToolbarContentService Methods

```typescript
// Register a custom template
registerCustomTemplate(template: ToolbarCustomTemplate): void

// Unregister a template by ID
unregisterCustomTemplate(id: string): void

// Get observable of all custom templates (sorted by order)
getCustomTemplates(): Observable<ToolbarCustomTemplate[]>

// Clear all custom templates
clearAllCustomTemplates(): void
```

### ToolbarCustomTemplate Interface

```typescript
interface ToolbarCustomTemplate {
  id: string;                      // Unique identifier (required)
  template: TemplateRef<unknown>;  // Angular template reference (required)
  order?: number;                  // Display order (default: 0, lower numbers appear first)
  label?: string;                  // Translation key shown alongside the template in the mobile settings drawer
}
```

### MenuItem Interface

```typescript
interface MenuItem {
  label: string;           // Menu item label (translation key)
  value?: string;          // Unique value/ID for the menu item
  icon?: string;           // Optional Material icon name
  disabled?: boolean;      // Disabled state (default: false)
  selected?: boolean;      // Selection state (default: false)
  showSelection?: boolean; // Show selection indicator (default: false)
  children?: MenuItem[];   // Nested submenu items (optional)
}
```

---

## Usage Example

### Simple Menu Dropdown in Toolbar

**app.ts:**
```typescript
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarContentService } from '@aum/templates/aum-template';
import { ButtonComponent } from '@aum/ui/buttons';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { HelpDialog, ContactUsDialog } from '@demo/playground';

@Component({
  imports: [RouterModule, MatMenuModule, ButtonComponent, MenuList, TranslateModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private dialog = inject(MatDialog);

  @ViewChild('moreOptionsMenu') moreOptionsMenuTemplate!: TemplateRef<unknown>;

  moreOptionsMenuItems: MenuItem[] = [
    { label: 'HELP', value: 'help', icon: 'help', showSelection: false },
    { label: 'CONTACT_US', value: 'contact', icon: 'email', showSelection: false },
  ];

  ngAfterViewInit(): void {
    if (this.moreOptionsMenuTemplate) {
      this.toolbarContentService.registerCustomTemplate({
        id: 'more-options-menu',
        template: this.moreOptionsMenuTemplate,
        order: 10,
      });
    }
  }

  onMoreOptionsSelect(item: MenuItem): void {
    switch (item.value) {
      case 'help':
        this.dialog.open(HelpDialog, { width: '600px', panelClass: 'aum-dialog-container' });
        break;
      case 'contact':
        this.dialog.open(ContactUsDialog, { width: '600px', panelClass: 'aum-dialog-container' });
        break;
    }
  }

  ngOnDestroy(): void {
    this.toolbarContentService.unregisterCustomTemplate('more-options-menu');
  }
}
```

**app.html:**
```html
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

---

## Menu Positioning

Custom templates appear in the toolbar in this order:

```
[Logo] [Menu] [Breadcrumb]  |  [Global Actions] [Custom Templates (by order)] [Preferences] [Profile]
```

Example ordering:
```typescript
{ id: 'admin',         order: 5  }  // Appears first
{ id: 'notifications', order: 8  }  // Appears second
{ id: 'more-options',  order: 10 }  // Appears third
```

---

## Best Practices

1. **Use `ngAfterViewInit`**: Register templates here (not `ngOnInit`) — `@ViewChild` is only available after the view initialises
2. **Unregister in `ngOnDestroy`**: Always clean up to prevent stale templates in the toolbar
3. **Use translation keys**: Always use `UPPER_CASE_SNAKE_CASE` for menu labels
4. **`showSelection: false` for actions**: Set this for items that trigger actions, not state toggles
5. **Unique IDs**: Use descriptive IDs like `'more-options-menu'`, not `'menu1'`
6. **Check template before registering**: Guard with `if (this.templateRef)` to avoid null errors
7. **Prefer `registerGlobalAction` for simple buttons**: Use custom templates only when you genuinely need custom HTML

---

## Translation Keys

Add all keys to every language file:

**en.json:**
```json
{
  "MORE_OPTIONS": "More Options",
  "HELP": "Help",
  "CONTACT_US": "Contact Us"
}
```

**ja.json:**
```json
{
  "MORE_OPTIONS": "その他のオプション",
  "HELP": "ヘルプ",
  "CONTACT_US": "お問い合わせ"
}
```

**hi.json:**
```json
{
  "MORE_OPTIONS": "अधिक विकल्प",
  "HELP": "मदद",
  "CONTACT_US": "हमसे संपर्क करें"
}
```

---

## Architecture

```
libs/aum-core/templates/aum-template/
├── services/
│   └── toolbar-content.service.ts   (Template registration service)
└── components/
    └── toolbar/
        ├── toolbar.component.ts      (Subscribes to custom templates)
        └── toolbar.component.html    (Renders templates with @for + ngTemplateOutlet)
```

---

_For standard action buttons, see [DYNAMIC-TOOLBAR-ACTIONS.md](./DYNAMIC-TOOLBAR-ACTIONS.md)._
