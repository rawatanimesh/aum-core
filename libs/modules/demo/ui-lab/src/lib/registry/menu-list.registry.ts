import { ApiRow } from '../shared/api-table/api-table';

export const MENU_LIST_META = {
  name: 'Menu List',
  selector: '<aum-menu-list>',
  importFrom: '@aum/ui/navigation',
  description:
    'A flat or nested action menu. Pass a MenuItem array with optional icons and nested children. Emits itemSelected on click. Supports disabled and selected states.',
  status: 'stable' as const,
};

export const MENU_LIST_INPUTS: ApiRow[] = [
  {
    name: 'list',
    type: 'MenuItem[]',
    default: '[]',
    description: 'Array of menu items to display. Each item can contain nested children to create submenus.',
    required: true,
  },
];

export const MENU_LIST_OUTPUTS: ApiRow[] = [
  {
    name: 'itemSelected',
    type: 'EventEmitter<MenuItem>',
    description: 'Emits the clicked MenuItem. Only fires for leaf items (items without children).',
  },
];

export const MENU_LIST_INTERFACES = [
  {
    name: 'MenuItem',
    definition: `interface MenuItem {
  label: string;              // display text
  value?: string;             // optional identifier for the item
  icon?: string;              // Material icon name shown before the label
  disabled?: boolean;         // prevents interaction and dims the item
  selected?: boolean;         // marks the item as active (managed internally)
  showSelection?: boolean;    // opt out of selection highlight
  children?: MenuItem[];      // nested items create a submenu
}`,
  },
];

export const MENU_LIST_EXAMPLES = {
  importPath: `import { MenuList, MenuItem } from '@aum/ui/navigation';`,

  basicUsage: `@Component({
  imports: [MenuList],
  template: \`
    <aum-menu-list
      [list]="items"
      (itemSelected)="onSelect($event)"
    ></aum-menu-list>
  \`,
})
export class MyComponent {
  items: MenuItem[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Profile', value: 'profile' },
    { label: 'Reports', value: 'reports' },
  ];

  onSelect(item: MenuItem) {
    console.log('Selected:', item.value);
  }
}`,

  withIcons: `items: MenuItem[] = [
  { label: 'Home', value: 'home', icon: 'home' },
  { label: 'Settings', value: 'settings', icon: 'settings' },
  { label: 'Notifications', value: 'notifications', icon: 'notifications' },
  { label: 'Help', value: 'help', icon: 'help' },
];`,

  nested: `items: MenuItem[] = [
  {
    label: 'File',
    children: [
      { label: 'New', value: 'new' },
      { label: 'Open', value: 'open' },
      { label: 'Save', value: 'save' },
    ],
  },
  {
    label: 'Edit',
    children: [
      { label: 'Cut', value: 'cut' },
      { label: 'Copy', value: 'copy' },
      { label: 'Paste', value: 'paste' },
    ],
  },
];`,

  withDisabled: `items: MenuItem[] = [
  { label: 'Active Item', value: 'active' },
  { label: 'Disabled Item', value: 'disabled', disabled: true },
  { label: 'Another Active', value: 'another' },
];`,
};
