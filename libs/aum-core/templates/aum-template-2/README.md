# @aum/templates/aum-template-2 — AumTemplate2

Application shell template with a **persistent sidebar** on desktop/tablet and a **slide-out mobile drawer** on narrow screens (≤ 700px). Recommended for new applications.

## When to use

Choose `AumTemplate2` when your app benefits from always-visible navigation on larger screens. The sidebar stays open on tablet and desktop; on mobile it collapses and a minimal header with a hamburger button appears instead.

For a toolbar-first layout with overlay sidenav, use [AumTemplate](../aum-template/README.md).

## Setup

### 1. Add to your route config

```typescript
// app.routes.ts
import { AumTemplate2 } from '@aum/templates/aum-template-2';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('@aum/common').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AumTemplate2,
    data: { drawerWidth: '240px' },   // optional — default is '200px'
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

`AumTemplate2` reads `brandLogo`, `appLogo`, `appName`, and `navItems` from `AppConfigService`. Provide your `app-config.json` via the `APP_CONFIG` token:

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
  "appLogo":   "assets/svgs/app-logo.svg",
  "appName":   "My App",
  "navItems": [
    { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard", "selected": true },
    {
      "label": "REPORTS", "value": "reports", "icon": "assessment", "expanded": false,
      "children": [
        { "label": "SALES", "value": "/reports/sales", "icon": "trending_up" }
      ]
    }
  ]
}
```

**Note:** `toolbarMenus` (preferences/profile) is not rendered by `AumTemplate2`. Those menus live inside the sidebar.

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `drawerWidth` | `string` | `'200px'` | CSS width of the mobile slide-out drawer |

## Layout behaviour

| Screen width | Layout |
|---|---|
| > 700px (tablet/desktop) | Sidebar visible, no mobile header, no drawer |
| ≤ 700px (mobile) | Sidebar hidden, mobile header shown (brand logo + hamburger), drawer opens on tap |

The breakpoint is controlled via Angular CDK `BreakpointObserver` at `(min-width: 700px)`. The drawer closes automatically when the screen widens past this breakpoint.

## Exports

```typescript
import { AumTemplate2 } from '@aum/templates/aum-template-2';
```

## Running tests

```bash
nx test aum-template-2
```
