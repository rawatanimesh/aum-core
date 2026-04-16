import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { GenericDialogExamples } from './generic-dialog-examples/generic-dialog-examples';
import {
  GENERIC_DIALOG_META,
  GENERIC_DIALOG_INPUTS,
  GENERIC_DIALOG_INTERFACES,
  GENERIC_DIALOG_EXAMPLES,
} from '../../registry/generic-dialog.registry';

@Component({
  selector: 'demo-generic-dialog-detail',
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
    GenericDialogExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generic-dialog-detail.html',
  styleUrl: './generic-dialog-detail.scss',
})
export class GenericDialogDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FEEDBACK', route: '/ui-lab/feedback' },
      { title: 'UI_LAB_GENERIC_DIALOG', route: '/ui-lab/feedback/generic-dialog' },
    ],
  };

  readonly meta = GENERIC_DIALOG_META;
  readonly inputs = GENERIC_DIALOG_INPUTS;
  readonly interfaces = GENERIC_DIALOG_INTERFACES;
  readonly examples = GENERIC_DIALOG_EXAMPLES;
}
