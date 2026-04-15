import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { TabsExamples } from './tabs-examples/tabs-examples';
import {
  TABS_META,
  TABS_GROUP_INPUTS,
  TABS_GROUP_OUTPUTS,
  TAB_INPUTS,
  TABS_INTERFACES,
  TABS_EXAMPLES,
} from '../../registry/tabs.registry';

@Component({
  selector: 'demo-tabs-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, TabsExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs-detail.html',
  styleUrl: './tabs-detail.scss',
})
export class TabsDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
      { title: 'UI_LAB_TABS', route: '/ui-lab/layout/tabs' },
    ],
  };

  readonly meta = TABS_META;
  readonly groupInputs = TABS_GROUP_INPUTS;
  readonly groupOutputs = TABS_GROUP_OUTPUTS;
  readonly tabInputs = TAB_INPUTS;
  readonly interfaces = TABS_INTERFACES;
  readonly examples = TABS_EXAMPLES;
}
