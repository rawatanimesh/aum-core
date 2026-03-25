import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ButtonComponent } from '@aum/ui/buttons';
import { CardComponent, PageComponent } from '@aum/ui/layout';

@Component({
  selector: 'demo-dashboard',
  imports: [PageComponent, CardComponent, ButtonComponent, MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);

  pageInfo = {
    breadcrumbs: [
      { title: 'DASHBOARD', route: '/dashboard' },
    ],
  };

  navigateToPlayground() {
    this.router.navigate(['/playground']);
  }

  featureList = [
    {
      title: 'PRODUCTION_QUALITY_TITLE',
      description: 'PRODUCTION_QUALITY_DESC',
      icon: 'verified',
    },
    {
      title: 'MODERN_ARCHITECTURE_TITLE',
      description: 'MODERN_ARCHITECTURE_DESC',
      icon: 'architecture',
    },
    {
      title: 'APP_SETUP_TITLE',
      description: 'APP_SETUP_DESC',
      icon: 'settings',
    },
    {
      title: 'COMPONENT_LIBRARY_TITLE',
      description: 'COMPONENT_LIBRARY_DESC',
      icon: 'widgets',
    },
    {
      title: 'PERSONALIZATION_TITLE',
      description: 'PERSONALIZATION_DESC',
      icon: 'tune',
    },
    {
      title: 'RESPONSIVE_DESIGN_TITLE',
      description: 'RESPONSIVE_DESIGN_DESC',
      icon: 'devices',
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
  ];
}
