import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { PasswordInputExamples } from './password-input-examples/password-input-examples';
import {
  PASSWORD_INPUT_META,
  PASSWORD_INPUT_INPUTS,
  PASSWORD_INPUT_OUTPUTS,
  PASSWORD_INPUT_EXAMPLES,
} from '../../registry/password-input.registry';

@Component({
  selector: 'demo-password-input-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, PasswordInputExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-input-detail.html',
  styleUrl: '../input-detail/input-detail.scss',
})
export class PasswordInputDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_PASSWORD_INPUT', route: '/ui-lab/form-controls/password-input' },
    ],
  };

  readonly meta = PASSWORD_INPUT_META;
  readonly inputs = PASSWORD_INPUT_INPUTS;
  readonly outputs = PASSWORD_INPUT_OUTPUTS;
  readonly examples = PASSWORD_INPUT_EXAMPLES;
}
