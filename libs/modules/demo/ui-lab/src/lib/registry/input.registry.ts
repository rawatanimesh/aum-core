import type { ApiRow } from '../shared/api-table/api-table';

export const INPUT_META = {
  name: 'Input',
  selector: 'aum-input',
  importFrom: '@aum/ui/form-controls',
  description:
    'Versatile text input supporting text, email, number, password types and textarea mode. Integrates with reactive forms for built-in validation error display.',
  status: 'stable' as const,
};

export const INPUT_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label shown above the field.' },
  { name: 'type', type: "'text' | 'email' | 'number' | 'password'", default: "'text'", description: 'HTML input type.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when the field is empty.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required; shows validation error when empty.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input, blocking all interaction.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows the current value without allowing edits.' },
  { name: 'textarea', type: 'boolean', default: 'false', description: 'Renders a multiline textarea instead of a single-line input.' },
  { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows for textarea mode.' },
  { name: 'maxlength', type: 'number | null', default: 'null', description: 'Maximum character count. Shows a counter when set.' },
  { name: 'control', type: 'FormControl', description: 'Reactive form control. Enables automatic error display.' },
  { name: 'data', type: 'string | number', default: "''", description: 'Standalone value binding. Pair with (dataChange) for two-way binding.' },
  { name: 'customErrorMessages', type: '{ [key: string]: string }', default: '{}', description: 'Overrides default error messages for specific validator keys.' },
];

export const INPUT_OUTPUTS: ApiRow[] = [
  { name: 'dataChange', type: 'EventEmitter<any>', description: 'Emits the new value on each change. Use with [(data)] for two-way binding.' },
];

export const INPUT_EXAMPLES = {
  importPath: `import { InputComponent } from '@aum/ui/form-controls';`,

  basicUsage: `<aum-input
  label="Full Name"
  placeholder="Enter your name"
  [(data)]="name"
></aum-input>`,

  inputTypes: `<!-- Email -->
<aum-input label="Email" type="email" [(data)]="email"></aum-input>

<!-- Password -->
<aum-input label="Password" type="password" [(data)]="password"></aum-input>

<!-- Number -->
<aum-input label="Age" type="number" [(data)]="age"></aum-input>`,

  textarea: `<aum-input
  label="Message"
  [textarea]="true"
  [rows]="5"
  [maxlength]="500"
  [(data)]="message"
></aum-input>`,

  validation: `// Component
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

emailControl = new FormControl('', [Validators.required, Validators.email]);
nameControl  = new FormControl('', [Validators.required, Validators.minLength(3)]);

// Template
<aum-input
  label="Name"
  [required]="true"
  [control]="nameControl"
></aum-input>

<aum-input
  label="Email"
  type="email"
  [required]="true"
  [control]="emailControl"
></aum-input>`,

  states: `<!-- Disabled -->
<aum-input label="Disabled" [disabled]="true" data="Cannot edit"></aum-input>

<!-- Readonly -->
<aum-input label="Readonly" [readonly]="true" data="View only"></aum-input>`,
};
