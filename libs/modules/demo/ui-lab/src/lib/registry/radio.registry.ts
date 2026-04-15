import type { ApiRow } from '../shared/api-table/api-table';

export const RADIO_META = {
  name: 'Radio',
  selector: 'aum-radio-button',
  importFrom: '@aum/ui/form-controls',
  description:
    'Radio button group for mutually exclusive selection from a list of options. Supports label positioning and per-option disabled state.',
  status: 'stable' as const,
};

export const RADIO_INPUTS: ApiRow[] = [
  { name: 'options', type: 'RadioOption[]', default: '[]', required: true, description: 'Array of radio options to render.' },
  { name: 'labelPosition', type: "'before' | 'after'", default: "'after'", description: 'Label position applied uniformly to all options.' },
];

export const RADIO_OUTPUTS: ApiRow[] = [
  { name: 'selectionChange', type: 'EventEmitter<RadioOption>', description: 'Emits the selected option object when selection changes.' },
];

export const RADIO_INTERFACES = [
  {
    name: 'RadioOption',
    definition: `interface RadioOption {
  label: string;
  value: any;
  selected?: boolean;
  disabled?: boolean;
}`,
  },
];

export const RADIO_EXAMPLES = {
  importPath: `import { RadioButton } from '@aum/ui/form-controls';`,

  basicUsage: `// Component
options: RadioOption[] = [
  { label: 'Small',  value: 'sm' },
  { label: 'Medium', value: 'md', selected: true },
  { label: 'Large',  value: 'lg' },
];

// Template
<aum-radio-button
  [options]="options"
  (selectionChange)="selected = $event.value"
></aum-radio-button>`,

  labelPositions: `<!-- Labels on the left -->
<aum-radio-button
  [options]="options"
  labelPosition="before"
></aum-radio-button>`,

  disabledOptions: `options: RadioOption[] = [
  { label: 'Available',   value: 'a' },
  { label: 'Unavailable', value: 'b', disabled: true },
  { label: 'Coming Soon', value: 'c', disabled: true },
];

<aum-radio-button [options]="options" (selectionChange)="selected = $event.value"></aum-radio-button>`,
};
