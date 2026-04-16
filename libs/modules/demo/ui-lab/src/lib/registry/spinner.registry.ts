import { ApiRow } from '../shared/api-table/api-table';

export const SPINNER_META = {
  name: 'Spinner',
  selector: '<aum-spinner>',
  importFrom: '@aum/ui/utilities',
  description:
    'A loading spinner wrapping Angular Material progress spinner. Supports element and page overlay modes, determinate/indeterminate types, optional text label, and configurable diameter.',
  status: 'stable' as const,
};

export const SPINNER_INPUTS: ApiRow[] = [
  {
    name: 'mode',
    type: "SpinnerMode ('page' | 'element')",
    default: "'element'",
    description:
      "Display mode. 'element' renders inline within its container. 'page' creates a full-screen overlay — use with caution as it blocks the entire UI.",
  },
  {
    name: 'type',
    type: "SpinnerType ('determinate' | 'indeterminate')",
    default: "'indeterminate'",
    description:
      "Spinner animation type. 'indeterminate' spins continuously. 'determinate' shows progress 0–100 via the [progress] input.",
  },
  {
    name: 'progress',
    type: 'number',
    default: '0',
    description: 'Current progress value (0–100). Only used when type is "determinate".',
  },
  {
    name: 'diameter',
    type: 'number',
    default: '50',
    description: 'Spinner diameter in pixels. Controls the visual size of the circular track.',
  },
  {
    name: 'text',
    type: 'string',
    default: "''",
    description: 'Optional label text displayed alongside the spinner.',
  },
  {
    name: 'textPosition',
    type: "TextPosition ('top' | 'bottom' | 'left' | 'right')",
    default: "'bottom'",
    description: "Position of the text label relative to the spinner circle.",
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '5',
    description: 'Width of the spinner track stroke in pixels.',
  },
  {
    name: 'overlayOpacity',
    type: 'number',
    default: '0.9',
    description: "Opacity of the overlay background. Only applies when mode is 'page'.",
  },
];

export const SPINNER_INTERFACES = [
  {
    name: 'SpinnerMode',
    definition: `type SpinnerMode = 'page' | 'element';
// 'element' — inline, scoped to container
// 'page'    — full-screen overlay (blocks UI)`,
  },
  {
    name: 'SpinnerType',
    definition: `type SpinnerType = 'determinate' | 'indeterminate';
// 'indeterminate' — continuous spin (default)
// 'determinate'   — arc fills based on [progress]`,
  },
  {
    name: 'TextPosition',
    definition: `type TextPosition = 'top' | 'bottom' | 'left' | 'right';
// Controls placement of [text] relative to the spinner`,
  },
];

export const SPINNER_EXAMPLES = {
  importPath: `import { Spinner } from '@aum/ui/utilities';`,

  basicUsage: `<!-- Indeterminate spinner with defaults (element mode, 50px) -->
<aum-spinner></aum-spinner>

<!-- Customise diameter and stroke -->
<aum-spinner [diameter]="36" [strokeWidth]="3"></aum-spinner>`,

  determinateExample: `<!-- Determinate spinner bound to a signal -->
@Component({
  imports: [Spinner],
  template: \`
    <aum-spinner type="determinate" [progress]="progress()"></aum-spinner>
    <aum-button value="+10%" (clickButton)="increase()"></aum-button>
  \`,
})
export class MyComponent {
  progress = signal(0);
  increase() { this.progress.update(v => Math.min(100, v + 10)); }
}`,

  withText: `<!-- Spinner with label in each position -->
<aum-spinner text="Loading..." textPosition="bottom"></aum-spinner>
<aum-spinner text="Please wait" textPosition="top"></aum-spinner>
<aum-spinner text="Syncing" textPosition="right"></aum-spinner>
<aum-spinner text="Saving" textPosition="left"></aum-spinner>`,

  pageMode: `<!-- ⚠️ Page mode creates a FULL-SCREEN overlay — use carefully -->
<!-- Ensure loading$ emits false eventually, or user cannot interact -->
@if (isLoading()) {
  <aum-spinner mode="page" text="Loading data..." [overlayOpacity]="0.8"></aum-spinner>
}`,
};
