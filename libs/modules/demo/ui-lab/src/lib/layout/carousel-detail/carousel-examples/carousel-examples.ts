import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CarouselComponent, CarouselItem, CarouselCardClickEvent } from '@aum/ui/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'demo-carousel-examples',
  imports: [CarouselComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './carousel-examples.html',
})
export class CarouselExamples {
  readonly basicItems: CarouselItem[] = [
    { imgUrl: 'https://picsum.photos/seed/aum1/400/280', title: 'Mountain View', description: 'A scenic mountain landscape' },
    { imgUrl: 'https://picsum.photos/seed/aum2/400/280', title: 'Ocean Sunset', description: 'Golden hour at the beach' },
    { imgUrl: 'https://picsum.photos/seed/aum3/400/280', title: 'Forest Path', description: 'A quiet walk through the trees' },
    { imgUrl: 'https://picsum.photos/seed/aum4/400/280', title: 'City Lights', description: 'Urban skyline at night' },
    { imgUrl: 'https://picsum.photos/seed/aum5/400/280', title: 'Desert Dunes', description: 'Rolling sand dunes at dawn' },
  ];

  readonly wideItems: CarouselItem[] = [
    { imgUrl: 'https://picsum.photos/seed/aum6/320/200', title: 'Slide 1' },
    { imgUrl: 'https://picsum.photos/seed/aum7/320/200', title: 'Slide 2' },
    { imgUrl: 'https://picsum.photos/seed/aum8/320/200', title: 'Slide 3' },
    { imgUrl: 'https://picsum.photos/seed/aum9/320/200', title: 'Slide 4' },
  ];

  lastClicked = signal<string>('—');

  onCardClick(event: CarouselCardClickEvent) {
    this.lastClicked.set(`"${event.item.title}" (index ${event.index})`);
  }
}
