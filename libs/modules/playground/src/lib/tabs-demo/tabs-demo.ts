import { Component } from '@angular/core';
import { TabGroupComponent, TabComponent, TabLabelDirective } from '@aum/ui/layout';
import { PageComponent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

interface DynamicTab {
  label: string;
  content: string;
  disabled?: boolean;
}

@Component({
  selector: 'playground-tabs-demo',
  standalone: true,
  imports: [
    TabGroupComponent,
    TabComponent,
    TabLabelDirective,
    PageComponent,
    ButtonComponent,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './tabs-demo.html',
  styleUrl: './tabs-demo.scss',
})
export class TabsDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'TABS', route: '/playground/tabs' },
    ],
  };

  // Basic tabs example
  selectedTab = 0;

  // Dynamic tabs example
  dynamicTabs: DynamicTab[] = [
    { label: 'TAB_ONE', content: 'Content for tab one' },
    { label: 'TAB_TWO', content: 'Content for tab two' },
    { label: 'TAB_THREE', content: 'Content for tab three', disabled: false },
  ];

  // Animation config
  animationDuration = '300ms';

  // Preserve scroll content demo
  preserveScrollContent = false;

  onTabChange(event: any) {
    console.log('Tab changed:', event);
    this.selectedTab = event.index;
  }

  addTab() {
    const newIndex = this.dynamicTabs.length + 1;
    this.dynamicTabs.push({
      label: `NEW_TAB_${newIndex}`,
      content: `Content for dynamically added tab ${newIndex}`,
    });
  }

  removeTab(index: number) {
    this.dynamicTabs.splice(index, 1);
  }

  toggleAnimation() {
    // Toggle between slow and fast animation
    this.animationDuration = this.animationDuration === '300ms' ? '1000ms' : '300ms';
  }

  togglePreserveScrollContent() {
    this.preserveScrollContent = !this.preserveScrollContent;
  }
}
