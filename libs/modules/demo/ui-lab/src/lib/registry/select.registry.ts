import type { ApiRow } from '../shared/api-table/api-table';

export const SELECT_META = {
  name: 'Select',
  selector: 'aum-select-box',
  importFrom: '@aum/ui/form-controls',
  description:
    'Dropdown select supporting single and multiple selection modes, reactive form integration, and per-option disabled state.',
  status: 'stable' as const,
};

export const SELECT_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label shown above the dropdown.' },
  { name: 'optionList', type: 'SelectOption[]', default: '[]', description: 'Array of options to display.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the select as required.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when no option is selected.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire select.' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables multi-select mode. Selected value becomes an array.' },
  { name: 'control', type: 'FormControl', description: 'Reactive form control for validation.' },
  { name: 'data', type: 'any | any[]', default: 'null', description: 'Standalone value binding. Pair with (dataChange).' },
  { name: 'customErrorMessages', type: 'Record<string, string>', default: '{}', description: 'Custom validation error message overrides.' },
];

export const SELECT_OUTPUTS: ApiRow[] = [
  { name: 'dataChange', type: 'EventEmitter<any | any[]>', description: 'Emits selected value(s) when selection changes.' },
];

export const SELECT_INTERFACES = [
  {
    name: 'SelectOption',
    definition: `interface SelectOption {
  value: any;
  text: string;
  disabled?: boolean;
}`,
  },
];

export const SELECT_EXAMPLES = {
  importPath: `import { SelectBox } from '@aum/ui/form-controls';
import type { SelectOption } from '@aum/ui/form-controls';`,

  singleSelect: `options: SelectOption[] = [
  { value: 'us', text: 'United States' },
  { value: 'gb', text: 'United Kingdom' },
  { value: 'jp', text: 'Japan' },
];

<aum-select-box
  label="Country"
  [optionList]="options"
  [(data)]="country"
></aum-select-box>`,

  multipleSelect: `tags: SelectOption[] = [
  { value: 'angular', text: 'Angular' },
  { value: 'ts', text: 'TypeScript' },
  { value: 'scss', text: 'SCSS' },
];

<aum-select-box
  label="Tags"
  [optionList]="tags"
  [multiple]="true"
  [(data)]="selectedTags"
></aum-select-box>
// selectedTags: string[] = []`,

  disabledOptions: `options: SelectOption[] = [
  { value: 'active',   text: 'Active' },
  { value: 'retired',  text: 'Retired',     disabled: true },
  { value: 'soon',     text: 'Coming Soon', disabled: true },
];

<!-- Fully disabled field -->
<aum-select-box label="Status" [disabled]="true" [optionList]="options"></aum-select-box>`,
};
