import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { ChartExamples } from './chart-examples/chart-examples';
import { CHART_META, CHART_INPUTS, CHART_OUTPUTS, CHART_INTERFACES, CHART_EXAMPLES } from '../../registry/chart.registry';

@Component({
  selector: 'demo-chart-detail',
  standalone: true,
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, TranslateModule, ComponentHeader, ApiTable, CodeBlock, ChartExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-detail.html',
  styleUrl: './chart-detail.scss',
})
export class ChartDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_DATA_DISPLAY', route: '/ui-lab/data-display' },
      { title: 'UI_LAB_CHART', route: '/ui-lab/data-display/chart' },
    ],
  };

  readonly meta = CHART_META;
  readonly inputs = CHART_INPUTS;
  readonly outputs = CHART_OUTPUTS;
  readonly interfaces = CHART_INTERFACES;
  readonly examples = CHART_EXAMPLES;
}
