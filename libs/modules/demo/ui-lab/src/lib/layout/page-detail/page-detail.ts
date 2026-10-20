import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@aum/ui/buttons';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { PageExamples } from './page-examples/page-examples';
import { PAGE_META, PAGE_INPUTS, PAGE_OUTPUTS, PAGE_EXAMPLES } from '../../registry/page.registry';

@Component({
  selector: 'demo-page-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, ButtonComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, PageExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-detail.html',
  styleUrl: '../card-detail/card-detail.scss',
})
export class PageDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
      { title: 'UI_LAB_PAGE', route: '/ui-lab/layout/page' },
    ],
  };

  readonly drawerOpen = signal(false);
  readonly drawerItems = Array.from({ length: 40 }, (_, i) => i + 1);

  toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }

  readonly meta = PAGE_META;
  readonly inputs = PAGE_INPUTS;
  readonly outputs = PAGE_OUTPUTS;
  readonly examples = PAGE_EXAMPLES;
}
