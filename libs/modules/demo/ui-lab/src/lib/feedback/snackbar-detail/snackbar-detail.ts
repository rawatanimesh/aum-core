import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { SnackbarExamples } from './snackbar-examples/snackbar-examples';
import {
  SNACKBAR_META,
  SNACKBAR_SERVICE_METHODS,
  SNACKBAR_INTERFACES,
  SNACKBAR_EXAMPLES,
} from '../../registry/snackbar.registry';

@Component({
  selector: 'demo-snackbar-detail',
  standalone: true,
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
    SnackbarExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snackbar-detail.html',
  styleUrl: './snackbar-detail.scss',
})
export class SnackbarDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FEEDBACK', route: '/ui-lab/feedback' },
      { title: 'UI_LAB_SNACKBAR', route: '/ui-lab/feedback/snackbar' },
    ],
  };

  readonly meta = SNACKBAR_META;
  readonly methods = SNACKBAR_SERVICE_METHODS;
  readonly interfaces = SNACKBAR_INTERFACES;
  readonly examples = SNACKBAR_EXAMPLES;
}
