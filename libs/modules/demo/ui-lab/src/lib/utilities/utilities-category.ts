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
  selector: 'demo-utilities-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './utilities-category.html',
  styleUrl: './utilities-category.scss',
})
export class UtilitiesCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_UTILITIES', route: '/ui-lab/utilities' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_ICON',
      selector: '<aum-icon>',
      descKey: 'UI_LAB_COMP_ICON_DESC',
      route: '/ui-lab/utilities/icon',
      icon: 'star',
    },
    {
      nameKey: 'UI_LAB_SPINNER',
      selector: '<aum-spinner>',
      descKey: 'UI_LAB_COMP_SPINNER_DESC',
      route: '/ui-lab/utilities/spinner',
      icon: 'progress_activity',
    },
  ];
}
