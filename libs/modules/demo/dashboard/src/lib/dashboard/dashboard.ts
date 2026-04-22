import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Icon } from '@aum/ui/utilities';

import { ButtonComponent } from '@aum/ui/buttons';
import { CardComponent, PageComponent } from '@aum/ui/layout';
import { FeatureDetailDialog } from '../feature-detail-dialog/feature-detail-dialog';

@Component({
  selector: 'demo-dashboard',
  imports: [PageComponent, CardComponent, ButtonComponent, Icon, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  pageInfo = {
    breadcrumbs: [
      { title: 'DASHBOARD', route: '/dashboard' },
    ],
  };

  navigateToUiLab() {
    this.router.navigate(['/ui-lab']);
  }

  navigateToGettingStarted() {
    this.router.navigate(['/getting-started']);
  }

  openFeatureDialog(feature: { title: string; description: string }) {
    this.dialog.open(FeatureDetailDialog, {
      width: '480px',
      data: feature,
      panelClass: 'aum-dialog-container',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  statsList = [
    { value: 'STAT_COMPONENTS', icon: 'widgets' },
    { value: 'STAT_TEMPLATES', icon: 'dashboard_customize' },
    { value: 'STAT_LANGUAGES', icon: 'translate' },
    { value: 'STAT_PALETTES', icon: 'palette' },
    { value: 'STAT_ACCESSIBILITY', icon: 'accessibility_new' },
  ];

  benefitsList = [
    { title: 'BENEFIT_MODERN_TITLE', description: 'BENEFIT_MODERN_DESC', icon: 'auto_awesome' },
    { title: 'BENEFIT_VELOCITY_TITLE', description: 'BENEFIT_VELOCITY_DESC', icon: 'bolt' },
    { title: 'BENEFIT_ENTERPRISE_TITLE', description: 'BENEFIT_ENTERPRISE_DESC', icon: 'domain' },
    { title: 'BENEFIT_BRAND_TITLE', description: 'BENEFIT_BRAND_DESC', icon: 'palette' },
    { title: 'BENEFIT_AI_TITLE', description: 'BENEFIT_AI_DESC', icon: 'smart_toy' },
    { title: 'BENEFIT_SLOP_TITLE', description: 'BENEFIT_SLOP_DESC', icon: 'rule' },
  ];

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
      title: 'PWA_TITLE',
      description: 'PWA_DESC',
      icon: 'install_mobile',
    },
    {
      title: 'GIT_SUBTREE_TITLE',
      description: 'GIT_SUBTREE_DESC',
      icon: 'account_tree',
    },
    {
      title: 'UI_LAB_TITLE',
      description: 'UI_LAB_SUBTITLE',
      icon: 'widgets',
    },
  ];
}
