import { Component } from '@angular/core';
import { PageComponent } from '@aum/ui/layout';
import { CarouselComponent, CarouselItem, CarouselCardClickEvent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-carousel',
  imports: [
    CarouselComponent,
    PageComponent,
    ButtonComponent,
    TranslateModule,
  ],
  templateUrl: './carousel-demo.html',
  styleUrl: './carousel-demo.scss',
})
export class CarouselDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'CAROUSEL', route: '/playground/carousels' },
    ],
  };

  // Sample carousel items
  basicItems: CarouselItem[] = [
    {
      imgUrl: 'assets/svgs/pixel-1.jpg',
      title: 'Learning Hub',
    },
    {
      imgUrl: 'assets/svgs/pixel-2.jpg',
      title: 'Project Manager',
    },
    {
      imgUrl: 'assets/svgs/pixel-3.jpg',
      title: 'Vendor Manager',
    },
    {
      imgUrl: 'assets/svgs/pixel-4.jpg',
      title: 'Agentic AI',
    },
    {
      imgUrl: 'assets/svgs/pixel-5.jpg',
      title: 'Blue Jira',
    },
  ];
  basicItems1 = [...this.basicItems, ...this.basicItems];

  // Items with descriptions
  fullFeatureItems: CarouselItem[] = [
    {
      imgUrl: 'assets/svgs/pixel-1.jpg',
      title: 'Learning Hub',
      description:
        'A comprehensive learning platform with courses, tutorials, and resources to help you master new skills and technologies.',
    },
    {
      imgUrl: 'assets/svgs/pixel-2.jpg',
      title: 'Project Manager',
      description:
        'Efficiently manage your projects with powerful tools for planning, tracking, and collaboration across teams.',
    },
    {
      imgUrl: 'assets/svgs/pixel-3.jpg',
      title: 'Vendor Manager',
      description:
        'Streamline vendor relationships, manage contracts, and optimize procurement processes all in one place.',
    },
  ];

  // Event log
  eventLog: string[] = [];

  onCardClick(event: CarouselCardClickEvent) {
    this.logEvent(`Card clicked: ${event.item.title} (index: ${event.index})`);
  }

  clearLog() {
    this.eventLog = [];
  }

  private logEvent(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.unshift(`[${timestamp}] ${message}`);
    if (this.eventLog.length > 10) {
      this.eventLog.pop();
    }
  }
}
