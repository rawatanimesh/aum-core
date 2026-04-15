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

## L2 Navigation

`navItems` entries with a `children` array enable two-level navigation:

- **Desktop/tablet:** Clicking an L1 parent item opens a secondary panel beside the sidebar showing its children. The L1 icon is highlighted with an `open` state (neutral background) while the panel is visible, and an `active` state (primary colour) when a child route is matched.
- **Mobile:** Clicking an L1 parent expands the drawer horizontally to show the L2 panel inline. The user must explicitly tap an L2 item to navigate — no auto-navigation occurs. Tapping an L2 item changes the route and closes the drawer.

```json
"navItems": [
  { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard" },
  {
    "label": "REPORTS",
    "value": "reports",
    "icon": "assessment",
    "children": [
      { "label": "SALES",    "value": "/reports/sales",    "icon": "trending_up" },
      { "label": "OVERVIEW", "value": "/reports/overview", "icon": "bar_chart"   }
    ]
  }
]
```

**Visual states for parent items:**

| CSS class | When applied | Appearance |
|---|---|---|
| `open` | L2 panel is visible (user clicked, no child route active yet) | Neutral highlight |
| `active` | A child route is currently matched by the router | Primary colour highlight |

## Layout behaviour

| Screen width | Layout |
|---|---|
| > 960px (desktop) | Sidebar visible + optional L2 panel beside it when an L1 parent is selected; no mobile header, no drawer |
| ≤ 960px (tablet/mobile) | Sidebar hidden, mobile header shown (brand logo + hamburger); drawer opens on tap and expands to show L2 panel inline when an L1 parent is tapped |

The breakpoint is controlled via Angular CDK `BreakpointObserver` at `(min-width: 961px)`, matching the standard `$breakpoint-tablet` (960px). The drawer closes automatically when the screen widens past this breakpoint.

## Exports

```typescript
import { AumTemplate2 } from '@aum/templates/aum-template-2';
```

## Running tests

```bash
nx test aum-template-2
```
