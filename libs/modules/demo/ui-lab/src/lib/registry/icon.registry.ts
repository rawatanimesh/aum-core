import { ApiRow } from '../shared/api-table/api-table';

export const ICON_META = {
  name: 'Icon',
  selector: '<aum-icon>',
  importFrom: '@aum/ui/utilities',
  description:
    'Renders a Material Symbol icon with scalable sizing and semantic color presets. Set [width] and [height] in px for auto rem-scaling. Use [color] with preset tokens or any CSS value.',
  status: 'stable' as const,
};

export const ICON_INPUTS: ApiRow[] = [
  {
    name: 'name',
    type: 'string',
    description: 'Material Symbol icon name (e.g. "home", "settings", "star"). Required.',
    required: true,
  },
  {
    name: 'library',
    type: 'string',
    default: "'material'",
    description: 'Icon library to use. Currently supports "material" (Material Symbols).',
  },
  {
    name: 'width',
    type: 'number',
    default: 'undefined',
    description: 'Icon width in px. Automatically converted to rem and scaled by --ui-scale.',
  },
  {
    name: 'height',
    type: 'number',
    default: 'undefined',
    description: 'Icon height in px. Automatically converted to rem and scaled by --ui-scale.',
  },
  {
    name: 'color',
    type: 'IconColor | string',
    default: 'undefined',
    description:
      "Semantic color preset or raw CSS value. Presets: 'primary' | 'secondary' | 'tertiary' | 'error' | 'on-surface' | 'on-surface-variant'. Raw CSS also works: color=\"var(--mat-sys-outline)\".",
  },
  {
    name: 'ariaLabel',
    type: 'string',
    default: 'undefined',
    description: 'Accessible label for screen readers. Set when the icon conveys meaning without surrounding text.',
  },
];

export const ICON_INTERFACES = [
  {
    name: 'IconColor',
    definition: `type IconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'on-surface'
  | 'on-surface-variant';

// Raw CSS values also accepted:
// color="var(--mat-sys-outline)"
// color="#ff0000"`,
  },
];

export const ICON_EXAMPLES = {
  importPath: `import { Icon } from '@aum/ui/utilities';`,

  basicUsage: `<!-- Minimal usage — just a name -->
<aum-icon name="home"></aum-icon>
<aum-icon name="settings"></aum-icon>
<aum-icon name="notifications"></aum-icon>`,

  withSize: `<!-- Control size via [width] and [height] (px values, auto-converted to rem) -->
<aum-icon name="star" [width]="16"></aum-icon>
<aum-icon name="star" [width]="24"></aum-icon>
<aum-icon name="star" [width]="32"></aum-icon>
<aum-icon name="star" [width]="48"></aum-icon>`,

  withColor: `<!-- Semantic color presets -->
<aum-icon name="circle" color="primary"></aum-icon>
<aum-icon name="circle" color="secondary"></aum-icon>
<aum-icon name="circle" color="tertiary"></aum-icon>
<aum-icon name="circle" color="error"></aum-icon>
<aum-icon name="circle" color="on-surface"></aum-icon>
<aum-icon name="circle" color="on-surface-variant"></aum-icon>

<!-- Raw CSS value -->
<aum-icon name="circle" color="var(--mat-sys-outline)"></aum-icon>`,

  inlineWithText: `<!-- Icon inside a sentence — use flex alignment -->
<div style="display: flex; align-items: center; gap: 8px;">
  <aum-icon name="check_circle" color="primary" [width]="20"></aum-icon>
  <span>Your changes have been saved.</span>
</div>

<!-- Button-like row with icon + label -->
<aum-button type="filled" icon="add" value="Add Item"></aum-button>`,

  dynamic: `@Component({
  imports: [Icon],
  template: \`
    <aum-icon [name]="currentIcon()" [width]="32" color="primary"></aum-icon>
    <aum-button value="Next" (clickButton)="cycleIcon()"></aum-button>
  \`,
})
export class MyComponent {
  private readonly icons = ['home', 'star', 'settings', 'favorite'];
  private index = signal(0);

  readonly currentIcon = computed(() => this.icons[this.index()]);

  cycleIcon() {
    this.index.update(i => (i + 1) % this.icons.length);
  }
}`,
};
