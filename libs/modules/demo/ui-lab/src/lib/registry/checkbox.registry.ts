import type { ApiRow } from '../shared/api-table/api-table';

export const CHECKBOX_META = {
  name: 'Checkbox',
  selector: 'aum-checkbox',
  importFrom: '@aum/ui/form-controls',
  description:
    'Single checkbox with support for indeterminate state (useful for select-all controls), customisable label positioning, and disabled mode.',
  status: 'stable' as const,
};

export const CHECKBOX_INPUTS: ApiRow[] = [
  { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate (dash) state — use for select-all when some but not all items are checked.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox, blocking all interaction.' },
  { name: 'label', type: 'string', default: "''", description: 'Text label displayed next to the checkbox.' },
  { name: 'labelPosition', type: "'before' | 'after'", default: "'after'", description: 'Position of the label relative to the checkbox.' },
];

export const CHECKBOX_OUTPUTS: ApiRow[] = [
  { name: 'checkedChange', type: 'EventEmitter<boolean>', description: 'Emits the new checked state when the checkbox is toggled.' },
  { name: 'indeterminateChange', type: 'EventEmitter<boolean>', description: 'Emits when the indeterminate state changes.' },
];

export const CHECKBOX_EXAMPLES = {
  importPath: `import { CheckboxComponent } from '@aum/ui/form-controls';`,

  basicUsage: `<aum-checkbox
  label="I agree to the terms"
  [checked]="agreed"
  (checkedChange)="agreed = $event"
></aum-checkbox>`,

  labelPositions: `<!-- Label after (default) -->
<aum-checkbox label="Notify me" labelPosition="after"></aum-checkbox>

<!-- Label before -->
<aum-checkbox label="Notify me" labelPosition="before"></aum-checkbox>`,

  indeterminate: `// all checked, some checked, none checked
allChecked  = computed(() => items().every(i => i.checked));
someChecked = computed(() => items().some(i => i.checked) && !allChecked());

// Template
<aum-checkbox
  label="Select all"
  [checked]="allChecked()"
  [indeterminate]="someChecked()"
  (checkedChange)="toggleAll($event)"
></aum-checkbox>`,

  states: `<!-- Disabled unchecked -->
<aum-checkbox label="Disabled" [disabled]="true"></aum-checkbox>

<!-- Disabled checked -->
<aum-checkbox label="Disabled checked" [checked]="true" [disabled]="true"></aum-checkbox>`,
};
