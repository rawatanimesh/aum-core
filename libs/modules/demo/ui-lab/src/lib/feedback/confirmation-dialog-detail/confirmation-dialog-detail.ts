import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { ConfirmationDialogExamples } from './confirmation-dialog-examples/confirmation-dialog-examples';
import {
  CONFIRMATION_DIALOG_META,
  CONFIRMATION_DIALOG_INTERFACES,
  CONFIRMATION_DIALOG_EXAMPLES,
} from '../../registry/confirmation-dialog.registry';

@Component({
  selector: 'demo-confirmation-dialog-detail',
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
    ConfirmationDialogExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-dialog-detail.html',
  styleUrl: './confirmation-dialog-detail.scss',
})
export class ConfirmationDialogDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FEEDBACK', route: '/ui-lab/feedback' },
      { title: 'UI_LAB_CONFIRMATION_DIALOG', route: '/ui-lab/feedback/confirmation-dialog' },
    ],
  };

  readonly meta = CONFIRMATION_DIALOG_META;
  readonly interfaces = CONFIRMATION_DIALOG_INTERFACES;
  readonly examples = CONFIRMATION_DIALOG_EXAMPLES;
}
