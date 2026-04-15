import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { DatepickerExamples } from './datepicker-examples/datepicker-examples';
import { DATEPICKER_META, DATEPICKER_INPUTS, DATEPICKER_OUTPUTS, DATEPICKER_EXAMPLES } from '../../registry/datepicker.registry';

@Component({
  selector: 'demo-datepicker-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, DatepickerExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker-detail.html',
  styleUrl: './datepicker-detail.scss',
})
export class DatepickerDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_DATEPICKER', route: '/ui-lab/form-controls/datepicker' },
    ],
  };

  readonly meta = DATEPICKER_META;
  readonly inputs = DATEPICKER_INPUTS;
  readonly outputs = DATEPICKER_OUTPUTS;
  readonly examples = DATEPICKER_EXAMPLES;
}
