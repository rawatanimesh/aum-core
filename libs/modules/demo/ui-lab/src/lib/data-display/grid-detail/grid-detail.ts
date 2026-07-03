import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { GridDemo } from '@demo/playground';
import { GRID_META, GRID_INPUTS, GRID_OUTPUTS, GRID_INTERFACES, GRID_EXAMPLES } from '../../registry/grid.registry';

@Component({
  selector: 'demo-grid-detail',
  standalone: true,
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, TranslateModule, ComponentHeader, ApiTable, CodeBlock, GridDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-detail.html',
  styleUrl: './grid-detail.scss',
})
export class GridDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB',             route: '/ui-lab' },
      { title: 'UI_LAB_DATA_DISPLAY', route: '/ui-lab/data-display' },
      { title: 'UI_LAB_GRID',         route: '/ui-lab/data-display/grid' },
    ],
  };

  readonly meta = GRID_META;
  readonly inputs = GRID_INPUTS;
  readonly outputs = GRID_OUTPUTS;
  readonly interfaces = GRID_INTERFACES;
  readonly examples = GRID_EXAMPLES;
}
