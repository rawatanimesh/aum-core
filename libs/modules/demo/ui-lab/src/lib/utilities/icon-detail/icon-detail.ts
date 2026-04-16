import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { IconExamples } from './icon-examples/icon-examples';
import {
  ICON_META,
  ICON_INPUTS,
  ICON_INTERFACES,
  ICON_EXAMPLES,
} from '../../registry/icon.registry';

@Component({
  selector: 'demo-icon-detail',
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
    IconExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-detail.html',
  styleUrl: './icon-detail.scss',
})
export class IconDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_UTILITIES', route: '/ui-lab/utilities' },
      { title: 'UI_LAB_ICON', route: '/ui-lab/utilities/icon' },
    ],
  };

  readonly meta = ICON_META;
  readonly inputs = ICON_INPUTS;
  readonly interfaces = ICON_INTERFACES;
  readonly examples = ICON_EXAMPLES;
}
