import { ApiRow } from '../shared/api-table/api-table';

export const BUTTON_TOGGLE_META = {
  name: 'Button Toggle',
  selector: '<aum-button-toggle>',
  importFrom: '@aum/ui/buttons',
  description:
    'A segmented control built on Angular Material Button Toggle. Supports single and multiple selection, optional icons per option, two size variants, and full disabled state. Ideal for view-mode selectors, filter chips, or any mutually-exclusive or multi-select set of options.',
  status: 'stable' as const,
};

export const BUTTON_TOGGLE_INPUTS: ApiRow[] = [
  {
    name: 'options',
    type: 'ButtonToggleOption[]',
    required: true,
    description:
      'Array of options to render. Each option must have label and value; icon and selected are optional.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description:
      'When true, allows multiple options to be selected simultaneously. Output changes to string[].',
  },
  {
    name: 'size',
    type: "'large' | 'small'",
    default: "'large'",
    description: 'large = 36px height, small = 28px height. Both scale with rem() density modes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Disables the entire toggle group. The selected state remains visible but interaction is blocked.',
  },
  {
    name: 'ariaLabel',
    type: 'string',
    default: "''",
    description: 'Accessible label for the toggle group. Recommended when no visible label exists.',
  },
];

export const BUTTON_TOGGLE_OUTPUTS: ApiRow[] = [
  {
    name: 'selectionChange',
    type: 'EventEmitter<string | string[]>',
    description:
      'Emits the selected value (single mode) or an array of selected values (multiple mode) on every change.',
  },
];

export const BUTTON_TOGGLE_INTERFACES = [
  {
    name: 'ButtonToggleOption',
    definition: `interface ButtonToggleOption {
  label: string;      // Display text — can be empty for icon-only
  value: string;      // Unique identifier, emitted on change
  selected?: boolean; // Pre-selected state
  icon?: string;      // Optional Material icon name
}`,
  },
];

export const BUTTON_TOGGLE_EXAMPLES = {
  basicUsage: `import { ButtonToggleComponent, ButtonToggleOption } from '@aum/ui/buttons';

@Component({
  imports: [ButtonToggleComponent],
  template: \`
    <aum-button-toggle
      [options]="options"
      (selectionChange)="selected = $event"
    ></aum-button-toggle>
  \`,
})
export class MyComponent {
  options: ButtonToggleOption[] = [
    { label: 'Day', value: 'day', selected: true },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];
  selected: string | string[] = 'day';
}`,

  withIcons: `options: ButtonToggleOption[] = [
  { label: 'List', value: 'list', icon: 'list', selected: true },
  { label: 'Grid', value: 'grid', icon: 'grid_view' },
  { label: 'Table', value: 'table', icon: 'table_chart' },
];`,

  multipleSelection: `<aum-button-toggle
  [options]="formatOptions"
  [multiple]="true"
  (selectionChange)="onFormatChange($event)"
></aum-button-toggle>`,

  iconOnly: `// Empty label + icon = icon-only toggle
options: ButtonToggleOption[] = [
  { label: '', value: 'left', icon: 'format_align_left', selected: true },
  { label: '', value: 'center', icon: 'format_align_center' },
  { label: '', value: 'right', icon: 'format_align_right' },
];`,
};
