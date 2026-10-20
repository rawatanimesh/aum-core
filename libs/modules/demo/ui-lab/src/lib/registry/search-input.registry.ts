import type { ApiRow } from '../shared/api-table/api-table';

export const SEARCH_INPUT_META = {
  name: 'Search Input',
  selector: 'aum-search-input',
  importFrom: '@aum/ui/form-controls',
  description:
    'Search field with a clickable search icon, Enter-key submit and a debounced change stream. Wraps aum-input, so it shares its sizing, label styles and form support.',
  status: 'stable' as const,
};

export const SEARCH_INPUT_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label shown above the field.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when the field is empty.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required; shows validation error when empty.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input, blocking all interaction.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows the current value without allowing edits.' },
  { name: 'size', type: "'medium' | 'large'", default: "'medium'", description: 'Controls field height and font size.' },
  { name: 'boldLabel', type: 'boolean', default: 'true', description: 'Renders the floating label in bold weight when true.' },
  { name: 'control', type: 'FormControl', description: 'Reactive form control. Enables automatic error display.' },
  { name: 'data', type: 'string | number', default: "''", description: 'Standalone value binding. Pair with (dataChange) for two-way binding.' },
  { name: 'customErrorMessages', type: '{ [key: string]: string }', default: '{}', description: 'Overrides default error messages for specific validator keys.' },
];

export const SEARCH_INPUT_OUTPUTS: ApiRow[] = [
  { name: 'search', type: 'EventEmitter<string>', description: 'Emits the current value when the user presses Enter or clicks the search icon.' },
  { name: 'searchChange', type: 'EventEmitter<string>', description: 'Emits the value 300ms after the user stops typing, skipping repeated values. Use for live filtering.' },
  { name: 'searchClear', type: 'EventEmitter<void>', description: 'Emits when the debounced value becomes empty.' },
  { name: 'dataChange', type: 'EventEmitter<any>', description: 'Emits the raw value on every keystroke. Use with [(data)] for two-way binding.' },
];

export const SEARCH_INPUT_EXAMPLES = {
  importPath: `import { SearchInputComponent } from '@aum/ui/form-controls';`,

  basicUsage: `<aum-search-input
  label="Search"
  placeholder="Type to search..."
  (search)="onSearch($event)"
></aum-search-input>`,

  events: `<!--
  search       → Enter key or icon click
  searchChange → debounced 300ms while typing
  searchClear  → debounced value is empty
-->
<aum-search-input
  label="Search"
  (search)="onSearch($event)"
  (searchChange)="onSearchChange($event)"
  (searchClear)="onSearchClear()"
></aum-search-input>`,

  filter: `// Component
query = signal('');
fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange'];
filtered = computed(() =>
  this.fruits.filter((f) => f.toLowerCase().includes(this.query().toLowerCase()))
);

// Template
<aum-search-input
  label="Filter fruits"
  (searchChange)="query.set($event)"
></aum-search-input>`,

  states: `<aum-search-input label="Search" [disabled]="true"></aum-search-input>`,

  sizeAndLabel: `<!-- Medium field, bold label (default) -->
<aum-search-input label="Search" size="medium" [boldLabel]="true"></aum-search-input>

<!-- Large field, normal label -->
<aum-search-input label="Search" size="large" [boldLabel]="false"></aum-search-input>`,
};
