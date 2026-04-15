import { ApiRow } from '../shared/api-table/api-table';

export const CARD_META = {
  name: 'Card',
  selector: '<aum-card>',
  importFrom: '@aum/ui/layout',
  description:
    'A surface container with optional padding and box-shadow. Use it to group related content into a visually distinct, elevation-aware block. Height and width are fully configurable.',
  status: 'stable' as const,
};

export const CARD_INPUTS: ApiRow[] = [
  {
    name: 'padding',
    type: 'boolean',
    default: 'true',
    description: 'When true, applies default internal padding. Set to false for flush content (e.g. images, tables).',
  },
  {
    name: 'boxShadow',
    type: 'boolean',
    default: 'true',
    description: 'Controls the Material elevation shadow. Disable for flat/outlined card styles.',
  },
  {
    name: 'height',
    type: 'string',
    default: "'auto'",
    description: 'Any valid CSS height value. Useful for fixed-height card grids.',
  },
  {
    name: 'width',
    type: 'string',
    default: "'100%'",
    description: 'Any valid CSS width value. Override to constrain card to a specific size.',
  },
];

export const CARD_OUTPUTS: ApiRow[] = [];

export const CARD_EXAMPLES = {
  importPath: `import { CardComponent } from '@aum/ui/layout';`,

  basicUsage: `<aum-card>
  <p>Card content goes here.</p>
</aum-card>`,

  noPadding: `<!-- Flush content — no internal padding -->
<aum-card [padding]="false">
  <img src="banner.jpg" alt="Banner" style="width: 100%; display: block;" />
</aum-card>`,

  noShadow: `<!-- Flat card — no elevation shadow -->
<aum-card [boxShadow]="false">
  <p>Flat surface, no shadow.</p>
</aum-card>`,

  customDimensions: `<!-- Fixed width and height -->
<aum-card width="320px" height="200px">
  <p>Fixed-size card.</p>
</aum-card>

<!-- Full-width, auto height (default) -->
<aum-card>
  <p>Full-width card.</p>
</aum-card>`,
};
