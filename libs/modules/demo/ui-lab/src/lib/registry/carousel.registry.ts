import { ApiRow } from '../shared/api-table/api-table';

export const CAROUSEL_META = {
  name: 'Carousel',
  selector: '<aum-carousel>',
  importFrom: '@aum/ui/layout',
  description:
    'A horizontally scrolling image carousel. Pass carouselItems with an image URL plus optional title and description. Supports navigation arrows, infinite scroll, two scroll modes (item or viewport), and a click event per card.',
  status: 'stable' as const,
};

export const CAROUSEL_INPUTS: ApiRow[] = [
  {
    name: 'carouselItems',
    type: 'CarouselItem[]',
    required: true,
    description: 'Array of items to display. Each item requires imgUrl; title and description are optional.',
  },
  {
    name: 'showArrows',
    type: 'boolean',
    default: 'true',
    description: 'Shows left and right navigation arrow buttons.',
  },
  {
    name: 'itemHeight',
    type: 'string',
    default: "'calc(25rem * var(--ui-scale))'",
    description: 'Height of each carousel card. Accepts any CSS length.',
  },
  {
    name: 'itemWidth',
    type: 'string',
    default: "'calc(25rem * var(--ui-scale))'",
    description: 'Width of each carousel card. Accepts any CSS length.',
  },
  {
    name: 'infiniteScroll',
    type: 'boolean',
    default: 'false',
    description: 'When true, the carousel loops back to the start after reaching the last item.',
  },
  {
    name: 'scrollMode',
    type: "'item' | 'viewport'",
    default: "'item'",
    description: "item: scroll by one card width. viewport: scroll by the full visible container width.",
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '20',
    description: 'Duration of the auto-scroll animation in seconds (used in auto-play mode).',
  },
];

export const CAROUSEL_OUTPUTS: ApiRow[] = [
  {
    name: 'cardClick',
    type: 'EventEmitter<CarouselCardClickEvent>',
    description: 'Emits { item, index } when a carousel card is clicked.',
  },
];

export const CAROUSEL_INTERFACES = [
  {
    name: 'CarouselItem',
    definition: `interface CarouselItem {
  imgUrl: string;         // Image URL (required)
  title?: string;         // Card title overlay
  description?: string;   // Card description overlay
}`,
  },
  {
    name: 'CarouselCardClickEvent',
    definition: `interface CarouselCardClickEvent {
  item: CarouselItem;  // The clicked item data
  index: number;       // Zero-based position in the array
}`,
  },
];

export const CAROUSEL_EXAMPLES = {
  importPath: `import { CarouselComponent } from '@aum/ui/layout';
import type { CarouselItem, CarouselCardClickEvent } from '@aum/ui/layout';`,

  basicUsage: `@Component({
  imports: [CarouselComponent],
  template: \`
    <aum-carousel [carouselItems]="items"></aum-carousel>
  \`,
})
export class MyComponent {
  items: CarouselItem[] = [
    { imgUrl: 'https://picsum.photos/seed/a/400/300', title: 'Mountain', description: 'A scenic view' },
    { imgUrl: 'https://picsum.photos/seed/b/400/300', title: 'Forest', description: 'Deep woods' },
    { imgUrl: 'https://picsum.photos/seed/c/400/300', title: 'Ocean', description: 'Blue waves' },
  ];
}`,

  customSize: `<!-- Custom card dimensions -->
<aum-carousel
  [carouselItems]="items"
  itemWidth="280px"
  itemHeight="180px"
></aum-carousel>`,

  scrollModes: `<!-- Scroll by one item (default) -->
<aum-carousel [carouselItems]="items" scrollMode="item"></aum-carousel>

<!-- Scroll by the entire visible viewport -->
<aum-carousel [carouselItems]="items" scrollMode="viewport"></aum-carousel>`,

  clickHandler: `@Component({
  template: \`
    <aum-carousel
      [carouselItems]="items"
      (cardClick)="onCardClick($event)"
    ></aum-carousel>
  \`,
})
export class MyComponent {
  items: CarouselItem[] = [...];

  onCardClick(event: CarouselCardClickEvent) {
    console.log('Clicked index:', event.index, 'Item:', event.item);
  }
}`,

  noArrows: `<!-- Hide navigation arrows — user scrolls with trackpad/touch -->
<aum-carousel [carouselItems]="items" [showArrows]="false"></aum-carousel>`,

  infiniteScroll: `<!-- Auto-scrolling carousel — hover to pause -->
<aum-carousel
  [carouselItems]="items"
  [infiniteScroll]="true"
  [animationDuration]="20"
></aum-carousel>

<!-- Faster speed — 10 second cycle -->
<aum-carousel
  [carouselItems]="items"
  [infiniteScroll]="true"
  [animationDuration]="10"
></aum-carousel>`,
};
