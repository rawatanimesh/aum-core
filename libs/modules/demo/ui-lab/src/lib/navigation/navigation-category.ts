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
  selector: 'demo-navigation-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-category.html',
  styleUrl: './navigation-category.scss',
})
export class NavigationCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_NAVIGATION', route: '/ui-lab/navigation' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_BREADCRUMB',
      selector: '<aum-breadcrumb>',
      descKey: 'UI_LAB_COMP_BREADCRUMB_DESC',
      route: '/ui-lab/navigation/breadcrumb',
      icon: 'more_horiz',
    },
    {
      nameKey: 'UI_LAB_MENU_LIST',
      selector: '<aum-menu-list>',
      descKey: 'UI_LAB_COMP_MENU_LIST_DESC',
      route: '/ui-lab/navigation/menu-list',
      icon: 'menu',
    },
  ];
}
