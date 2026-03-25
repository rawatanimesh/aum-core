# @aum/templates/aum-template — AumTemplate

Application shell template with a **persistent top toolbar** and a **hamburger-toggled overlay sidenav**.

## When to use

Choose `AumTemplate` when your app needs a fixed top bar that is always visible and a side navigation that slides in over the content on demand.

For a persistent sidebar layout with responsive mobile drawer, use [AumTemplate2](../aum-template-2/README.md) instead.

## Setup

### 1. Add to your route config

```typescript
// app.routes.ts
import { AumTemplate } from '@aum/templates/aum-template';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('@aum/common').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AumTemplate,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@myapp/dashboard').then(m => m.DashboardComponent),
      },
      { path: '**', loadComponent: () => import('@aum/common').then(m => m.PageNotFoundComponent) },
    ],
  },
];
```

### 2. Provide app config

`AumTemplate` reads navigation items and toolbar menus from `AppConfigService`. Provide your `app-config.json` via the `APP_CONFIG` token:

```typescript
// app.config.ts
import { APP_CONFIG } from '@aum/utils/services';
import appConfigJson from './app-config.json';

providers: [
  { provide: APP_CONFIG, useValue: appConfigJson },
]
```

### 3. Configure `app-config.json`

```json
{
  "brandLogo": "assets/svgs/brand-logo.svg",
  "appName": "My App",
  "navItems": [
    { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard", "selected": true }
  ],
  "toolbarMenus": {
    "preferences": {
      "show": true,
      "items": { "theme": { "show": true }, "language": { "show": true } }
    },
    "profile": {
      "show": true,
      "items": { "logout": { "show": true } }
    }
  }
}
```

## Toolbar customisation

### Dynamic action buttons

Register/unregister buttons in the toolbar from any page component:

```typescript
export class MyPage implements OnInit, OnDestroy {
  private toolbar = inject(ToolbarContentService);

  ngOnInit() {
    this.toolbar.registerGlobalAction(
      { id: 'save', icon: 'save', tooltip: 'SAVE', type: 'icon', order: 1 },
      () => this.save()
    );
  }

  ngOnDestroy() {
    this.toolbar.unregisterGlobalAction('save');
  }
}
```

See [docs/DYNAMIC-TOOLBAR-ACTIONS.md](../../../../docs/DYNAMIC-TOOLBAR-ACTIONS.md).

### Custom dropdown menus

Add custom `ng-template`-based menus to the toolbar:

```typescript
@ViewChild('myMenu') myMenuTemplate!: TemplateRef<unknown>;

ngAfterViewInit() {
  this.toolbarContentService.registerCustomTemplate({
    id: 'my-menu', template: this.myMenuTemplate, order: 10,
  });
}
```

See [docs/CUSTOM_TOOLBAR_MENU_USAGE.md](../../../../docs/CUSTOM_TOOLBAR_MENU_USAGE.md).

## Exports

```typescript
import { AumTemplate }            from '@aum/templates/aum-template';
import { ToolbarContentService }  from '@aum/templates/aum-template';
import { AppEventBusService }     from '@aum/templates/aum-template';
import { AppEventType }           from '@aum/templates/aum-template';
```

## Running tests

```bash
nx test aum-template
```
