import { ApiRow } from '../shared/api-table/api-table';

export const EXPANSION_PANEL_META = {
  name: 'Expansion Panel',
  selector: '<aum-expansion-panel>',
  importFrom: '@aum/ui/layout',
  description:
    'An accordion built on Angular Material Expansion Panel. Pass an array of items with header and optional content. Supports single-open (accordion) or multi-open modes, default-expanded items, disabled items, and programmatic expand/collapse all.',
  status: 'stable' as const,
};

export const EXPANSION_PANEL_INPUTS: ApiRow[] = [
  {
    name: 'items',
    type: 'ExpansionPanelItem[]',
    required: true,
    description: 'Array of panel definitions. Each item requires a header; content, expanded, and disabled are optional.',
  },
  {
    name: 'multi',
    type: 'boolean',
    default: 'false',
    description: 'When false (accordion mode) opening one panel closes the others. When true, panels open independently.',
  },
  {
    name: 'width',
    type: 'string',
    default: "'100%'",
    description: 'CSS width of the entire expansion panel group.',
  },
];

export const EXPANSION_PANEL_OUTPUTS: ApiRow[] = [];

export const EXPANSION_PANEL_INTERFACES = [
  {
    name: 'ExpansionPanelItem',
    definition: `interface ExpansionPanelItem {
  header: string;        // Panel header text
  content?: any;         // Simple string content
  expanded?: boolean;    // Pre-expanded state
  disabled?: boolean;    // Prevent expand/collapse
}`,
  },
];

export const EXPANSION_PANEL_EXAMPLES = {
  importPath: `import { ExpansionPanel, ExpansionPanelContentDirective } from '@aum/ui/layout';
import type { ExpansionPanelItem } from '@aum/ui/layout';`,

  basicUsage: `@Component({
  imports: [ExpansionPanel],
  template: \`
    <aum-expansion-panel [items]="items"></aum-expansion-panel>
  \`,
})
export class MyComponent {
  items: ExpansionPanelItem[] = [
    { header: 'What is AUM?', content: 'AUM is an Angular component library.' },
    { header: 'How do I install it?', content: 'Run: npm install @aum/ui' },
    { header: 'Is it free?', content: 'Yes, AUM is open source.' },
  ];
}`,

  multiMode: `<!-- Multiple panels can be open simultaneously -->
<aum-expansion-panel #panel [items]="items" [multi]="true"></aum-expansion-panel>

<!-- Programmatic expand / collapse all (multi mode only) -->
<aum-button value="Expand All" (clickButton)="panel.expandAll()"></aum-button>
<aum-button value="Collapse All" (clickButton)="panel.collapseAll()"></aum-button>`,

  defaultExpanded: `items: ExpansionPanelItem[] = [
  { header: 'Open by default', content: 'This panel starts expanded.', expanded: true },
  { header: 'Closed by default', content: 'This one starts collapsed.' },
];`,

  disabledItem: `items: ExpansionPanelItem[] = [
  { header: 'Active panel', content: 'Can be toggled.' },
  { header: 'Locked panel', content: 'Cannot be toggled.', disabled: true },
];`,

  contentProjection: `<!-- Project rich content with index-based conditionals -->
<aum-expansion-panel [items]="sections">
  <ng-template aumExpansionPanelContent let-index="index">
    @if (index === 0) {
      <!-- Buttons section -->
      <aum-button type="filled" value="Save"></aum-button>
      <aum-button type="outlined" value="Cancel"></aum-button>
    } @else if (index === 1) {
      <!-- Checkboxes section -->
      <aum-checkbox label="Option A" [checked]="true"></aum-checkbox>
      <aum-checkbox label="Option B"></aum-checkbox>
    } @else {
      <!-- Form inputs section -->
      <aum-input label="Name" placeholder="Enter name"></aum-input>
      <aum-input label="Email" type="email"></aum-input>
    }
  </ng-template>
</aum-expansion-panel>`,
};
