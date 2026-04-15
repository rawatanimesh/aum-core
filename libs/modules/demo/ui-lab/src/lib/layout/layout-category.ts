import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

interface ComponentCard {
  nameKey: string;
  selector: string;
  descKey: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'demo-layout-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout-category.html',
  styleUrl: './layout-category.scss',
})
export class LayoutCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_CARD',
      selector: '<aum-card>',
      descKey: 'UI_LAB_COMP_CARD_DESC',
      route: '/ui-lab/layout/card',
      icon: 'crop_square',
    },
    {
      nameKey: 'UI_LAB_TABS',
      selector: '<aum-tab-group>',
      descKey: 'UI_LAB_COMP_TABS_DESC',
      route: '/ui-lab/layout/tabs',
      icon: 'tab',
    },
    {
      nameKey: 'UI_LAB_EXPANSION_PANEL',
      selector: '<aum-expansion-panel>',
      descKey: 'UI_LAB_COMP_EXPANSION_PANEL_DESC',
      route: '/ui-lab/layout/expansion-panel',
      icon: 'expand_more',
    },
    {
      nameKey: 'UI_LAB_CAROUSEL',
      selector: '<aum-carousel>',
      descKey: 'UI_LAB_COMP_CAROUSEL_DESC',
      route: '/ui-lab/layout/carousel',
      icon: 'view_carousel',
    },
  ];
}
