import { ApiRow } from '../shared/api-table/api-table';

export const PAGE_META = {
  name: 'Page',
  selector: '<aum-page>',
  importFrom: '@aum/ui/layout',
  description:
    'The page shell every screen is built on. It sets breadcrumbs, projects the page body, and provides a built-in side drawer with optional fixed header and footer. The page you are viewing is itself an aum-page, so everything below is live.',
  status: 'stable' as const,
};

export const PAGE_INPUTS: ApiRow[] = [
  {
    name: 'pageInfo',
    type: '{ breadcrumbs: { title: string; route: string }[] }',
    description: 'Sets the breadcrumb trail for the page. Titles can be translation keys.',
  },
  {
    name: 'openDrawer',
    type: 'boolean',
    description: 'Opens the side drawer when true and closes it when false.',
  },
  {
    name: 'drawerWidth',
    type: 'number',
    default: '25',
    description: 'Drawer width in rem.',
  },
  {
    name: 'drawerPosition',
    type: "'start' | 'end'",
    default: "'end'",
    description: 'Which edge of the page the drawer slides in from.',
  },
  {
    name: 'drawerMode',
    type: "'over' | 'push' | 'side'",
    default: "'over'",
    description: 'Whether the drawer overlays the page, pushes it, or sits beside it.',
  },
  {
    name: 'enableBrowserNavigation',
    type: 'boolean',
    default: 'false',
    description: 'Warns the user before they refresh, go back or go forward, e.g. while a form has unsaved changes.',
  },
  {
    name: 'navigationWarningMessage',
    type: 'string',
    default: "'You have unsaved changes. Are you sure you want to leave?'",
    description: 'Message shown in the confirmation prompt when browser navigation protection is on.',
  },
];

export const PAGE_OUTPUTS: ApiRow[] = [
  {
    name: 'beforeBrowserNavigation',
    type: "EventEmitter<{ event: BeforeUnloadEvent | PopStateEvent; type: 'refresh' | 'back' | 'forward' }>",
    description: 'Emits when the user attempts to refresh or navigate back/forward while protection is enabled.',
  },
];

export const PAGE_EXAMPLES = {
  importPath: `import { PageComponent } from '@aum/ui/layout';`,

  basicUsage: `<aum-page [pageInfo]="pageInfo">
  <div aum-page-body>
    <!-- page content -->
  </div>
</aum-page>

// Component
pageInfo = {
  breadcrumbs: [
    { title: 'UI_LAB', route: '/ui-lab' },
    { title: 'UI_LAB_PAGE', route: '/ui-lab/layout/page' },
  ],
};`,

  drawer: `<aum-page
  [pageInfo]="pageInfo"
  [openDrawer]="drawerOpen"
  [drawerWidth]="30"
  drawerPosition="end"
  drawerMode="over"
>
  <div aum-page-body>…</div>

  <!-- optional, fixed at the top of the drawer -->
  <div aum-drawer-header class="flex-row-space-between-center">
    <span class="fs-14 fw-600">Title</span>
    <aum-button type="icon" icon="close" (clickButton)="drawerOpen = false"></aum-button>
  </div>

  <!-- scrolls when content overflows -->
  <div aum-drawer-content>…</div>

  <!-- optional, fixed at the bottom of the drawer -->
  <div aum-drawer-footer>
    <aum-button type="filled" size="small" value="Save"></aum-button>
  </div>
</aum-page>`,

  navigation: `<aum-page
  [pageInfo]="pageInfo"
  [enableBrowserNavigation]="form.dirty"
  navigationWarningMessage="You have unsaved changes."
  (beforeBrowserNavigation)="onBeforeNavigation($event)"
>
  <div aum-page-body>…</div>
</aum-page>`,
};
