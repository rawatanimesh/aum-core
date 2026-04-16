import { ApiRow } from '../shared/api-table/api-table';

export const BREADCRUMB_META = {
  name: 'Breadcrumb',
  selector: '<aum-breadcrumb>',
  importFrom: '@aum/ui/navigation',
  description:
    'Reads from BreadcrumbService and renders a clickable navigation trail. Call setBreadcrumbs() from any component to update the trail programmatically.',
  status: 'stable' as const,
};

export const BREADCRUMB_INPUTS: ApiRow[] = [];

export const BREADCRUMB_OUTPUTS: ApiRow[] = [];

export const BREADCRUMB_INTERFACES = [
  {
    name: 'BreadcrumbItem',
    definition: `interface BreadcrumbItem {
  route: string;   // navigation target for the breadcrumb link
  title: string;   // display text shown in the trail
}`,
  },
  {
    name: 'BreadcrumbService',
    definition: `class BreadcrumbService {
  breadcrumbs$: Observable<BreadcrumbItem[]>;

  // Set the full breadcrumb trail
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void;

  // Clear the trail (renders nothing)
  clear(): void;
}`,
  },
];

export const BREADCRUMB_EXAMPLES = {
  importPath: `import { BreadcrumbComponent, BreadcrumbService, BreadcrumbItem } from '@aum/ui/navigation';`,

  serviceSetup: `@Component({
  imports: [BreadcrumbComponent],
  template: \`<aum-breadcrumb></aum-breadcrumb>\`,
})
export class MyPageComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { title: 'Home', route: '/' },
      { title: 'Products', route: '/products' },
      { title: 'Laptop', route: '/products/laptop' },
    ]);
  }
}`,

  programmatic: `// Update the trail from any component or service
const items: BreadcrumbItem[] = [
  { title: 'Dashboard', route: '/dashboard' },
  { title: 'Users', route: '/dashboard/users' },
  { title: 'Profile', route: '/dashboard/users/profile' },
  { title: 'Settings', route: '/dashboard/users/profile/settings' },
];
this.breadcrumbService.setBreadcrumbs(items);

// Clear the trail
this.breadcrumbService.clear();`,

  clearExample: `@Component({
  template: \`
    <aum-breadcrumb></aum-breadcrumb>
    <aum-button type="outlined" value="Clear" (clickButton)="clear()"></aum-button>
  \`,
})
export class MyComponent {
  private breadcrumbService = inject(BreadcrumbService);

  clear() {
    this.breadcrumbService.clear();
  }
}`,
};
