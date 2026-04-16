import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { SpinnerExamples } from './spinner-examples/spinner-examples';
import {
  SPINNER_META,
  SPINNER_INPUTS,
  SPINNER_INTERFACES,
  SPINNER_EXAMPLES,
} from '../../registry/spinner.registry';

@Component({
  selector: 'demo-spinner-detail',
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
    SpinnerExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner-detail.html',
  styleUrl: './spinner-detail.scss',
})
export class SpinnerDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_UTILITIES', route: '/ui-lab/utilities' },
      { title: 'UI_LAB_SPINNER', route: '/ui-lab/utilities/spinner' },
    ],
  };

  readonly meta = SPINNER_META;
  readonly inputs = SPINNER_INPUTS;
  readonly interfaces = SPINNER_INTERFACES;
  readonly examples = SPINNER_EXAMPLES;
}
