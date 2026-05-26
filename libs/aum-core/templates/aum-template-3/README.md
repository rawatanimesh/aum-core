# @aum/templates/aum-template-3 — AumTemplate3

Hybrid application shell that combines the **global toolbar** of Template 1 with the **persistent collapsible sidebar** of Template 2. Ideal when you need both a persistent header (for branding, toolbar actions, and user menus) and always-visible navigation.

## When to use

Choose `AumTemplate3` when your app needs:

- A **persistent toolbar** at the top for global actions, branding, preferences, and profile menu
- A **persistent sidebar** that collapses to icon-only on desktop (saving screen space) and opens as an overlay on mobile

For toolbar-only with overlay sidenav, use [AumTemplate](../aum-template/README.md).
For sidebar-only without a toolbar, use [AumTemplate2](../aum-template-2/README.md).

## Layout behaviour

| Screen width | Layout |
|---|---|
| > 960px (desktop) | Full toolbar at top; persistent sidebar on the left (collapsed = icon-only, expanded = icon + label). Hamburger toggles between the two states. |
| ≤ 960px (mobile/tablet) | Full toolbar at top; sidebar hidden. Hamburger opens a full-width overlay drawer. Active parent submenus auto-open when the drawer opens. |

## Sidebar behaviour

- **Collapsed (desktop):** Items show icon + label stacked vertically. Parent items show a small chevron badge. Clicking a parent auto-expands the sidebar and opens its submenu.
- **Expanded (desktop):** Items show icon + label side by side. Parent items show an `expand_more`/`expand_less` chevron at the row end. Clicking a parent toggles its submenu inline.
- **Mobile overlay:** Sidebar always renders in expanded mode. The active parent's submenu is opened automatically when the drawer opens.

## Setup

### 1. Add to your route config

```typescript
// app.routes.ts
import { AumTemplate3 } from '@aum/templates/aum-template-3';

export const appRoutes: Route[] = [
  { path: 'login', loadComponent: () => import('@aum/common').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AumTemplate3,
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
    { "label": "DASHBOARD", "value": "/dashboard", "icon": "dashboard" },
    {
      "label": "REPORTS", "value": "reports", "icon": "assessment",
      "children": [
        { "label": "SALES",    "value": "/reports/sales",    "icon": "trending_up" },
        { "label": "OVERVIEW", "value": "/reports/overview", "icon": "bar_chart"   }
      ]
    }
  ],
  "toolbarMenus": {
    "preferences": { "show": true },
    "profile":     { "show": true }
  }
}
```

## Toolbar

The toolbar is identical to Template 1 — it supports:

- Brand logo / app logo / app name (from `app-config.json`)
- Dynamic global actions via `ToolbarContentService` (see [DYNAMIC-TOOLBAR-ACTIONS.md](../../../../../../../docs/DYNAMIC-TOOLBAR-ACTIONS.md))
- Custom toolbar templates (see [CUSTOM-TOOLBAR-TEMPLATES.md](../../../../../../../docs/CUSTOM-TOOLBAR-TEMPLATES.md))
- Preferences and profile menus (configured via `toolbarMenus` in `app-config.json`)
- Hamburger icon that toggles between `menu` and `menu_open` on desktop only

## Exports

```typescript
import { AumTemplate3 } from '@aum/templates/aum-template-3';
```

## Running tests

```bash
nx test aum-template-3
```
