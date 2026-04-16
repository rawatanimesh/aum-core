import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { BreadcrumbExamples } from './breadcrumb-examples/breadcrumb-examples';
import {
  BREADCRUMB_META,
  BREADCRUMB_INPUTS,
  BREADCRUMB_OUTPUTS,
  BREADCRUMB_INTERFACES,
  BREADCRUMB_EXAMPLES,
} from '../../registry/breadcrumb.registry';

@Component({
  selector: 'demo-breadcrumb-detail',
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
    BreadcrumbExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb-detail.html',
  styleUrl: './breadcrumb-detail.scss',
})
export class BreadcrumbDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_NAVIGATION', route: '/ui-lab/navigation' },
      { title: 'UI_LAB_BREADCRUMB', route: '/ui-lab/navigation/breadcrumb' },
    ],
  };

  readonly meta = BREADCRUMB_META;
  readonly inputs = BREADCRUMB_INPUTS;
  readonly outputs = BREADCRUMB_OUTPUTS;
  readonly interfaces = BREADCRUMB_INTERFACES;
  readonly examples = BREADCRUMB_EXAMPLES;
}
