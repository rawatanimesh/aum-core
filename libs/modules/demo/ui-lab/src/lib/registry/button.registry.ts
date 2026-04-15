import { ApiRow } from '../shared/api-table/api-table';

export const BUTTON_META = {
  name: 'Button',
  selector: '<aum-button>',
  importFrom: '@aum/ui/buttons',
  description:
    'A versatile button component built on Angular Material with four visual variants, two size options, optional leading icon, tooltip, and custom width. Wraps the Material button directives while enforcing AUM design tokens.',
  status: 'stable' as const,
};

export const BUTTON_INPUTS: ApiRow[] = [
  {
    name: 'type',
    type: "'filled' | 'outlined' | 'basic' | 'icon'",
    default: "'filled'",
    description:
      'Visual variant. filled = primary action, outlined = secondary, basic = low-emphasis, icon = compact icon-only button.',
  },
  {
    name: 'value',
    type: 'string',
    default: "''",
    description: 'Button label text. Not required when type is icon.',
  },
  {
    name: 'icon',
    type: 'string',
    default: "''",
    description:
      'Material icon name. When used with a text type, renders a leading icon alongside the label.',
  },
  {
    name: 'size',
    type: "'large' | 'small'",
    default: "'large'",
    description:
      'large = 36px height (default), small = 28px height. Uses rem() so it scales with density modes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button and suppresses pointer events.',
  },
  {
    name: 'tooltip',
    type: 'string',
    default: "''",
    description:
      'Material tooltip text shown on hover. Recommended on icon-only buttons to expose the action label.',
  },
  {
    name: 'htmlType',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description: 'HTML button type attribute — useful for form submissions.',
  },
  {
    name: 'width',
    type: 'string',
    default: "''",
    description:
      'Any valid CSS length (e.g. "100%", "20rem"). Stretches the button for full-width CTAs.',
  },
];

export const BUTTON_OUTPUTS: ApiRow[] = [
  {
    name: 'clickButton',
    type: 'EventEmitter<MouseEvent>',
    description: 'Emits the native MouseEvent when the button is clicked.',
  },
];

export const BUTTON_EXAMPLES = {
  basicUsage: `import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  imports: [ButtonComponent],
  template: \`
    <aum-button type="filled" value="Save"></aum-button>
    <aum-button type="outlined" value="Cancel"></aum-button>
    <aum-button type="basic" value="Learn more"></aum-button>
  \`,
})
export class MyComponent {}`,

  withIcon: `<!-- Leading icon + label -->
<aum-button type="filled" icon="add" value="Add Item"></aum-button>
<aum-button type="outlined" icon="download" value="Export"></aum-button>
<aum-button type="basic" icon="delete" value="Delete"></aum-button>

<!-- Icon-only with tooltip -->
<aum-button type="icon" icon="more_vert" tooltip="More options"></aum-button>`,

  sizeVariants: `<aum-button type="filled" size="large" value="Large"></aum-button>
<aum-button type="filled" size="small" value="Small"></aum-button>`,

  clickHandler: `@Component({
  template: \`
    <aum-button
      type="filled"
      value="Submit"
      (clickButton)="onSubmit($event)"
    ></aum-button>
  \`,
})
export class MyComponent {
  onSubmit(event: MouseEvent) {
    console.log('clicked', event);
  }
}`,

  customWidth: `<aum-button type="filled" value="Full width" width="100%"></aum-button>
<aum-button type="outlined" value="Fixed" width="20rem"></aum-button>`,
};
