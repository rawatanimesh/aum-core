import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

interface CatalogCategory {
  titleKey: string;
  descKey: string;
  icon: string;
  route: string;
  count: number;
}

@Component({
  selector: 'demo-ui-lab-catalog',
  standalone: true,
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-lab-catalog.html',
  styleUrl: './ui-lab-catalog.scss',
})
export class UiLabCatalog {
  pageInfo = {
    breadcrumbs: [{ title: 'UI_LAB', route: '/ui-lab' }],
  };

  readonly categories: CatalogCategory[] = [
    {
      titleKey: 'UI_LAB_BUTTONS',
      descKey: 'UI_LAB_CAT_BUTTONS_DESC',
      icon: 'smart_button',
      route: '/ui-lab/buttons',
      count: 2,
    },
    {
      titleKey: 'UI_LAB_FORM_CONTROLS',
      descKey: 'UI_LAB_CAT_FORM_CONTROLS_DESC',
      icon: 'edit_note',
      route: '/ui-lab/form-controls',
      count: 6,
    },
    {
      titleKey: 'UI_LAB_LAYOUT',
      descKey: 'UI_LAB_CAT_LAYOUT_DESC',
      icon: 'dashboard',
      route: '/ui-lab/layout',
      count: 4,
    },
    {
      titleKey: 'UI_LAB_NAVIGATION',
      descKey: 'UI_LAB_CAT_NAVIGATION_DESC',
      icon: 'menu',
      route: '/ui-lab/navigation',
      count: 2,
    },
    {
      titleKey: 'UI_LAB_FEEDBACK',
      descKey: 'UI_LAB_CAT_FEEDBACK_DESC',
      icon: 'notifications',
      route: '/ui-lab/feedback',
      count: 3,
    },
    {
      titleKey: 'UI_LAB_UTILITIES',
      descKey: 'UI_LAB_CAT_UTILITIES_DESC',
      icon: 'construction',
      route: '/ui-lab/utilities',
      count: 2,
    },
    {
      titleKey: 'UI_LAB_DATA_DISPLAY',
      descKey: 'UI_LAB_CAT_DATA_DISPLAY_DESC',
      icon: 'bar_chart',
      route: '/ui-lab/data-display',
      count: 1,
    },
  ];

}
