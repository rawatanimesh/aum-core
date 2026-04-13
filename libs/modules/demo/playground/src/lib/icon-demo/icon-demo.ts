import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';

@Component({
  selector: 'demo-icon',
  standalone: true,
  imports: [CommonModule, PageComponent, Icon],
  templateUrl: './icon-demo.html',
  styleUrl: './icon-demo.scss',
})
export class IconDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'ICONS', route: '/playground/icons' },
    ],
  };

  // Scenario 3: dynamic binding — switchable icon name
  dynamicIconNames = ['home', 'settings', 'notifications', 'favorite', 'star', 'search'];
  currentIconIndex = 0;

  get dynamicIcon(): string {
    return this.dynamicIconNames[this.currentIconIndex];
  }

  cycleDynamicIcon() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.dynamicIconNames.length;
  }
}
