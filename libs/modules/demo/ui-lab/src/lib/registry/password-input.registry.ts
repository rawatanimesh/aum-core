import type { ApiRow } from '../shared/api-table/api-table';

export const PASSWORD_INPUT_META = {
  name: 'Password Input',
  selector: 'aum-password-input',
  importFrom: '@aum/ui/form-controls',
  description:
    'Password field with a built-in show/hide toggle. Wraps aum-input, so it shares its sizing, label styles and reactive form validation.',
  status: 'stable' as const,
};

export const PASSWORD_INPUT_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label shown above the field.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when the field is empty.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required; shows validation error when empty.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input, blocking all interaction.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows the current value without allowing edits.' },
  { name: 'maxlength', type: 'number | null', default: 'null', description: 'Maximum character count. Shows a counter when set.' },
  { name: 'size', type: "'medium' | 'large'", default: "'medium'", description: 'Controls field height and font size.' },
  { name: 'boldLabel', type: 'boolean', default: 'true', description: 'Renders the floating label in bold weight when true.' },
  { name: 'control', type: 'FormControl', description: 'Reactive form control. Enables automatic error display.' },
  { name: 'data', type: 'string | number', default: "''", description: 'Standalone value binding. Pair with (dataChange) for two-way binding.' },
  { name: 'customErrorMessages', type: '{ [key: string]: string }', default: '{}', description: 'Overrides default error messages for specific validator keys.' },
];

export const PASSWORD_INPUT_OUTPUTS: ApiRow[] = [
  { name: 'dataChange', type: 'EventEmitter<any>', description: 'Emits the new value on each change. Use with [(data)] for two-way binding.' },
];

export const PASSWORD_INPUT_EXAMPLES = {
  importPath: `import { PasswordInputComponent } from '@aum/ui/form-controls';`,

  basicUsage: `<aum-password-input
  label="Password"
  placeholder="Enter password"
  [(data)]="password"
></aum-password-input>`,

  validation: `// Component
import { FormControl, Validators } from '@angular/forms';

passwordControl = new FormControl('', [
  Validators.required,
  Validators.minLength(8),
]);

// Template
<aum-password-input
  label="Password"
  [required]="true"
  [control]="passwordControl"
  [customErrorMessages]="{ minlength: 'Use at least 8 characters.' }"
></aum-password-input>`,

  states: `<!-- Disabled -->
<aum-password-input label="Password" [disabled]="true"></aum-password-input>

<!-- Readonly -->
<aum-password-input label="Password" [readonly]="true" data="secret"></aum-password-input>`,

  sizeAndLabel: `<!-- Medium field, bold label (default) -->
<aum-password-input label="Password" size="medium" [boldLabel]="true"></aum-password-input>

<!-- Large field, normal label -->
<aum-password-input label="Password" size="large" [boldLabel]="false"></aum-password-input>`,
};
