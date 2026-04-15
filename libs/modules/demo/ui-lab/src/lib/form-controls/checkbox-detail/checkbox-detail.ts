import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { CheckboxExamples } from './checkbox-examples/checkbox-examples';
import { CHECKBOX_META, CHECKBOX_INPUTS, CHECKBOX_OUTPUTS, CHECKBOX_EXAMPLES } from '../../registry/checkbox.registry';

@Component({
  selector: 'demo-checkbox-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, CheckboxExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-detail.html',
  styleUrl: './checkbox-detail.scss',
})
export class CheckboxDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_CHECKBOX', route: '/ui-lab/form-controls/checkbox' },
    ],
  };

  readonly meta = CHECKBOX_META;
  readonly inputs = CHECKBOX_INPUTS;
  readonly outputs = CHECKBOX_OUTPUTS;
  readonly examples = CHECKBOX_EXAMPLES;
}
