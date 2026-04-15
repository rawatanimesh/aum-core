import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { ExpansionPanelExamples } from './expansion-panel-examples/expansion-panel-examples';
import {
  EXPANSION_PANEL_META,
  EXPANSION_PANEL_INPUTS,
  EXPANSION_PANEL_OUTPUTS,
  EXPANSION_PANEL_INTERFACES,
  EXPANSION_PANEL_EXAMPLES,
} from '../../registry/expansion-panel.registry';

@Component({
  selector: 'demo-expansion-panel-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, ExpansionPanelExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expansion-panel-detail.html',
  styleUrl: './expansion-panel-detail.scss',
})
export class ExpansionPanelDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
      { title: 'UI_LAB_EXPANSION_PANEL', route: '/ui-lab/layout/expansion-panel' },
    ],
  };

  readonly meta = EXPANSION_PANEL_META;
  readonly inputs = EXPANSION_PANEL_INPUTS;
  readonly outputs = EXPANSION_PANEL_OUTPUTS;
  readonly interfaces = EXPANSION_PANEL_INTERFACES;
  readonly examples = EXPANSION_PANEL_EXAMPLES;
}
