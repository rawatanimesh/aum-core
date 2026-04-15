import { ApiRow } from '../shared/api-table/api-table';

export const TABS_META = {
  name: 'Tabs',
  selector: '<aum-tab-group>',
  importFrom: '@aum/ui/layout',
  description:
    'A tab container built on Angular Material Tabs. Compose with <aum-tab> children to create labelled panels. Supports programmatic selection, animated transitions, header positioning, and lazy/eager content preservation.',
  status: 'stable' as const,
};

export const TABS_GROUP_INPUTS: ApiRow[] = [
  {
    name: 'selectedIndex',
    type: 'number',
    default: '0',
    description: 'Zero-based index of the initially selected tab. Supports two-way binding via (selectedIndexChange).',
  },
  {
    name: 'animationDuration',
    type: 'string',
    default: "'300ms'",
    description: 'Duration of the tab transition animation. Any valid CSS time value (e.g. "0ms" to disable).',
  },
  {
    name: 'headerPosition',
    type: "'above' | 'below'",
    default: "'above'",
    description: 'Places the tab header strip above or below the content panel.',
  },
  {
    name: 'preserveContent',
    type: 'boolean',
    default: 'false',
    description: 'When true, all tab content is kept in the DOM after first render instead of being destroyed on switch.',
  },
];

export const TABS_GROUP_OUTPUTS: ApiRow[] = [
  {
    name: 'selectedIndexChange',
    type: 'EventEmitter<number>',
    description: 'Emits the new selected index whenever the active tab changes.',
  },
  {
    name: 'selectedTabChange',
    type: 'EventEmitter<MatTabChangeEvent>',
    description: 'Emits the full Material tab change event, including the tab component reference.',
  },
];

export const TAB_INPUTS: ApiRow[] = [
  {
    name: 'label',
    type: 'string',
    default: "''",
    description: 'Text label shown in the tab header strip.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Prevents the tab from being selected and dims the header label.',
  },
];

export const TABS_INTERFACES = [
  {
    name: 'TabGroupComponent',
    definition: `// aum-tab-group inputs
selectedIndex?: number;       // active tab (0-based)
animationDuration?: string;   // default '300ms'
headerPosition?: 'above' | 'below';
preserveContent?: boolean;    // keep all panels in DOM`,
  },
  {
    name: 'TabComponent',
    definition: `// aum-tab inputs
label: string;      // header text
disabled?: boolean; // prevent selection`,
  },
];

export const TABS_EXAMPLES = {
  importPath: `import { TabGroupComponent, TabComponent, TabLabelDirective } from '@aum/ui/layout';`,

  basicUsage: `<aum-tab-group>
  <aum-tab label="Overview">
    <p>Overview content.</p>
  </aum-tab>
  <aum-tab label="Details">
    <p>Details content.</p>
  </aum-tab>
  <aum-tab label="Settings">
    <p>Settings content.</p>
  </aum-tab>
</aum-tab-group>`,

  selectedIndex: `@Component({
  template: \`
    <aum-tab-group
      [selectedIndex]="activeTab"
      (selectedIndexChange)="activeTab = $event"
    >
      <aum-tab label="Tab A"><p>Content A</p></aum-tab>
      <aum-tab label="Tab B"><p>Content B</p></aum-tab>
    </aum-tab-group>

    <aum-button value="Go to Tab B" (clickButton)="activeTab = 1"></aum-button>
  \`,
})
export class MyComponent {
  activeTab = 0;
}`,

  disabledTab: `<aum-tab-group>
  <aum-tab label="Enabled"><p>Active tab.</p></aum-tab>
  <aum-tab label="Disabled" [disabled]="true"><p>Never shown.</p></aum-tab>
  <aum-tab label="Also Enabled"><p>Another active tab.</p></aum-tab>
</aum-tab-group>`,

  headerBelow: `<!-- Tab strip rendered below the content panel -->
<aum-tab-group headerPosition="below">
  <aum-tab label="Step 1"><p>First step content.</p></aum-tab>
  <aum-tab label="Step 2"><p>Second step content.</p></aum-tab>
</aum-tab-group>`,

  customLabel: `<!-- Icon + text in tab header using TabLabelDirective -->
<aum-tab-group>
  <aum-tab>
    <ng-template aum-tab-label>
      <aum-icon name="mail" [width]="16"></aum-icon>
      <span>Inbox (5)</span>
    </ng-template>
    <p>Inbox content.</p>
  </aum-tab>

  <aum-tab>
    <ng-template aum-tab-label>
      <aum-icon name="drafts" [width]="16"></aum-icon>
      <span>Drafts</span>
    </ng-template>
    <p>Drafts content.</p>
  </aum-tab>
</aum-tab-group>`,

  preserveContent: `<!-- preserveContent keeps DOM alive across switches — preserves scroll position -->
<aum-tab-group [preserveContent]="true">
  <aum-tab label="Short"><p>Minimal content.</p></aum-tab>
  <aum-tab label="Long">
    <!-- Scroll to bottom, switch tab, come back — position is maintained -->
    @for (i of longList; track i) {
      <p>Paragraph {{ i }}</p>
    }
  </aum-tab>
</aum-tab-group>`,
};
