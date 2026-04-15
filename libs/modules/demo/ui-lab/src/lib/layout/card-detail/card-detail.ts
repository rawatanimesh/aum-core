import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { CardExamples } from './card-examples/card-examples';
import { CARD_META, CARD_INPUTS, CARD_OUTPUTS, CARD_EXAMPLES } from '../../registry/card.registry';

@Component({
  selector: 'demo-card-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, CardExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.scss',
})
export class CardDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
      { title: 'UI_LAB_CARD', route: '/ui-lab/layout/card' },
    ],
  };

  readonly meta = CARD_META;
  readonly inputs = CARD_INPUTS;
  readonly outputs = CARD_OUTPUTS;
  readonly examples = CARD_EXAMPLES;
}
