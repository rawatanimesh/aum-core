import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { InputExamples } from './input-examples/input-examples';
import { INPUT_META, INPUT_INPUTS, INPUT_OUTPUTS, INPUT_EXAMPLES } from '../../registry/input.registry';

@Component({
  selector: 'demo-input-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, InputExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-detail.html',
  styleUrl: './input-detail.scss',
})
export class InputDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_INPUT', route: '/ui-lab/form-controls/input' },
    ],
  };

  readonly meta = INPUT_META;
  readonly inputs = INPUT_INPUTS;
  readonly outputs = INPUT_OUTPUTS;
  readonly examples = INPUT_EXAMPLES;
}
