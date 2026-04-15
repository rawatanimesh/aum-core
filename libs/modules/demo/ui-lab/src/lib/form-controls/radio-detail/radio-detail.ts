import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { RadioExamples } from './radio-examples/radio-examples';
import { RADIO_META, RADIO_INPUTS, RADIO_OUTPUTS, RADIO_INTERFACES, RADIO_EXAMPLES } from '../../registry/radio.registry';

@Component({
  selector: 'demo-radio-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, RadioExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-detail.html',
  styleUrl: './radio-detail.scss',
})
export class RadioDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_RADIO', route: '/ui-lab/form-controls/radio' },
    ],
  };

  readonly meta = RADIO_META;
  readonly inputs = RADIO_INPUTS;
  readonly outputs = RADIO_OUTPUTS;
  readonly interfaces = RADIO_INTERFACES;
  readonly examples = RADIO_EXAMPLES;
}
