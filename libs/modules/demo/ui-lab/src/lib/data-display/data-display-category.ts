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
  selector: 'demo-data-display-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-display-category.html',
  styleUrl: './data-display-category.scss',
})
export class DataDisplayCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_DATA_DISPLAY', route: '/ui-lab/data-display' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_CHART',
      selector: '<aum-chart>',
      descKey: 'UI_LAB_COMP_CHART_DESC',
      route: '/ui-lab/data-display/chart',
      icon: 'bar_chart',
    },
  ];
}
