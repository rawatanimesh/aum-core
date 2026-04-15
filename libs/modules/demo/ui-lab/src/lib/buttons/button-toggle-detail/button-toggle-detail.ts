import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { ButtonToggleExamples } from './button-toggle-examples/button-toggle-examples';
import {
  BUTTON_TOGGLE_META,
  BUTTON_TOGGLE_INPUTS,
  BUTTON_TOGGLE_OUTPUTS,
  BUTTON_TOGGLE_INTERFACES,
  BUTTON_TOGGLE_EXAMPLES,
} from '../../registry/button-toggle.registry';

@Component({
  selector: 'demo-button-toggle-detail',
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
    ButtonToggleExamples,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-toggle-detail.html',
  styleUrl: './button-toggle-detail.scss',
})
export class ButtonToggleDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_BUTTONS', route: '/ui-lab/buttons' },
      { title: 'UI_LAB_BUTTON_TOGGLE', route: '/ui-lab/buttons/button-toggle' },
    ],
  };

  readonly meta = BUTTON_TOGGLE_META;
  readonly inputs = BUTTON_TOGGLE_INPUTS;
  readonly outputs = BUTTON_TOGGLE_OUTPUTS;
  readonly interfaces = BUTTON_TOGGLE_INTERFACES;
  readonly examples = BUTTON_TOGGLE_EXAMPLES;
}
