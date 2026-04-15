import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { SelectExamples } from './select-examples/select-examples';
import { SELECT_META, SELECT_INPUTS, SELECT_OUTPUTS, SELECT_INTERFACES, SELECT_EXAMPLES } from '../../registry/select.registry';

@Component({
  selector: 'demo-select-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, SelectExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-detail.html',
  styleUrl: './select-detail.scss',
})
export class SelectDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_SELECT', route: '/ui-lab/form-controls/select' },
    ],
  };

  readonly meta = SELECT_META;
  readonly inputs = SELECT_INPUTS;
  readonly outputs = SELECT_OUTPUTS;
  readonly interfaces = SELECT_INTERFACES;
  readonly examples = SELECT_EXAMPLES;
}
