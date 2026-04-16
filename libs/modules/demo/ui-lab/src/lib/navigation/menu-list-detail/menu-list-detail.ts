import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { MenuListExamples } from './menu-list-examples/menu-list-examples';
import {
  MENU_LIST_META,
  MENU_LIST_INPUTS,
  MENU_LIST_OUTPUTS,
  MENU_LIST_INTERFACES,
  MENU_LIST_EXAMPLES,
} from '../../registry/menu-list.registry';

@Component({
  selector: 'demo-menu-list-detail',
  imports: [
    RouterModule,
    PageComponent,
    TabGroupComponent,
    TabComponent,
    Icon,
    TranslateModule,
    ComponentHeader,
    ApiTable,
    CodeBlock,
    MenuListExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-list-detail.html',
  styleUrl: './menu-list-detail.scss',
})
export class MenuListDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_NAVIGATION', route: '/ui-lab/navigation' },
      { title: 'UI_LAB_MENU_LIST', route: '/ui-lab/navigation/menu-list' },
    ],
  };

  readonly meta = MENU_LIST_META;
  readonly inputs = MENU_LIST_INPUTS;
  readonly outputs = MENU_LIST_OUTPUTS;
  readonly interfaces = MENU_LIST_INTERFACES;
  readonly examples = MENU_LIST_EXAMPLES;
}
