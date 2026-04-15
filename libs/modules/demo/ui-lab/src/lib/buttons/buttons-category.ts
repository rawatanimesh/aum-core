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
  selector: 'demo-buttons-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buttons-category.html',
  styleUrl: './buttons-category.scss',
})
export class ButtonsCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_BUTTONS', route: '/ui-lab/buttons' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_BUTTON',
      selector: '<aum-button>',
      descKey: 'UI_LAB_COMP_BUTTON_DESC',
      route: '/ui-lab/buttons/button',
      icon: 'smart_button',
    },
    {
      nameKey: 'UI_LAB_BUTTON_TOGGLE',
      selector: '<aum-button-toggle>',
      descKey: 'UI_LAB_COMP_BUTTON_TOGGLE_DESC',
      route: '/ui-lab/buttons/button-toggle',
      icon: 'toggle_on',
    },
  ];
}
