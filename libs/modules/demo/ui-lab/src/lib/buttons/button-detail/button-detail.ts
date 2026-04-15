import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { ButtonExamples } from './button-examples/button-examples';
import {
  BUTTON_META,
  BUTTON_INPUTS,
  BUTTON_OUTPUTS,
  BUTTON_EXAMPLES,
} from '../../registry/button.registry';

@Component({
  selector: 'demo-button-detail',
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
    ButtonExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-detail.html',
  styleUrl: './button-detail.scss',
})
export class ButtonDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_BUTTONS', route: '/ui-lab/buttons' },
      { title: 'UI_LAB_BUTTON', route: '/ui-lab/buttons/button' },
    ],
  };

  readonly meta = BUTTON_META;
  readonly inputs = BUTTON_INPUTS;
  readonly outputs = BUTTON_OUTPUTS;
  readonly examples = BUTTON_EXAMPLES;
}
