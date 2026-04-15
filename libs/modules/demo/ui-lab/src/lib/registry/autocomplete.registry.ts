import type { ApiRow } from '../shared/api-table/api-table';

export const AUTOCOMPLETE_META = {
  name: 'Autocomplete',
  selector: 'aum-autocomplete',
  importFrom: '@aum/ui/form-controls',
  description:
    'Type-ahead input that filters a provided option list as the user types. Supports reactive forms and disabled/readonly states.',
  status: 'stable' as const,
};

export const AUTOCOMPLETE_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label shown above the input.' },
  { name: 'optionList', type: 'SelectOption[]', default: '[]', description: 'Full list of options to filter from.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when the field is empty.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows the current value without allowing edits.' },
  { name: 'control', type: 'FormControl', description: 'Reactive form control for validation.' },
  { name: 'data', type: 'any | null', default: 'null', description: 'Standalone value binding.' },
  { name: 'customErrorMessages', type: 'Record<string, string>', default: '{}', description: 'Custom validation error message overrides.' },
];

export const AUTOCOMPLETE_OUTPUTS: ApiRow[] = [
  { name: 'dataChange', type: 'EventEmitter<any | null>', description: 'Emits the selected option value when a selection is made.' },
];

export const AUTOCOMPLETE_EXAMPLES = {
  importPath: `import { Autocomplete } from '@aum/ui/form-controls';
import type { SelectOption } from '@aum/ui/form-controls';`,

  basicUsage: `options: SelectOption[] = [
  { value: 'ng',     text: 'Angular' },
  { value: 'react',  text: 'React' },
  { value: 'vue',    text: 'Vue' },
  { value: 'svelte', text: 'Svelte' },
];

<aum-autocomplete
  label="Framework"
  [optionList]="options"
  [(data)]="selected"
></aum-autocomplete>`,

  searchFilter: `// optionList is the full set — aum-autocomplete handles filtering
<aum-autocomplete
  label="City"
  placeholder="Type to search..."
  [optionList]="cities"
  [(data)]="selectedCity"
></aum-autocomplete>`,

  states: `<!-- Disabled -->
<aum-autocomplete
  label="Disabled"
  [disabled]="true"
  [optionList]="options"
></aum-autocomplete>

<!-- Readonly -->
<aum-autocomplete
  label="Readonly"
  [readonly]="true"
  data="Angular"
  [optionList]="options"
></aum-autocomplete>`,
};
