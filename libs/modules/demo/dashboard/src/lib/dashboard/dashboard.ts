import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CardComponent, PageComponent } from '@aum/ui/layout';

@Component({
  selector: 'demo-dashboard',
  imports: [PageComponent, CardComponent, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  pageInfo = {
    breadcrumbs: [
      { title: 'DASHBOARD', route: '/dashboard' },
    ],
  };

  featureList = [
    {
      title: 'COMPONENT_LIBRARY_TITLE',
      description: 'COMPONENT_LIBRARY_DESC',
      icon: 'widgets',
    },
    {
      title: 'APP_SETUP_TITLE',
      description: 'APP_SETUP_DESC',
      icon: 'settings',
    },
    {
      title: 'PERSONALIZATION_TITLE',
      description: 'PERSONALIZATION_DESC',
      icon: 'tune',
    },
    {
      title: 'CSP_TITLE',
      description: 'CSP_DESC',
      icon: 'security',
    },
    {
      title: 'GIT_SUBTREE_TITLE',
      description: 'GIT_SUBTREE_DESC',
      icon: 'account_tree',
    },
    {
      title: 'PLAYGROUND_TITLE',
      description: 'PLAYGROUND_DESC',
      icon: 'play_arrow',
    },
    {
      title: 'MODERN_ARCHITECTURE_TITLE',
      description: 'MODERN_ARCHITECTURE_DESC',
      icon: 'architecture',
    },
    {
      title: 'PRODUCTION_QUALITY_TITLE',
      description: 'PRODUCTION_QUALITY_DESC',
      icon: 'verified',
    },
  ];
}
