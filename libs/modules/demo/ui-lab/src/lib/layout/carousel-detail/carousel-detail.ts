import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { CarouselExamples } from './carousel-examples/carousel-examples';
import {
  CAROUSEL_META,
  CAROUSEL_INPUTS,
  CAROUSEL_OUTPUTS,
  CAROUSEL_INTERFACES,
  CAROUSEL_EXAMPLES,
} from '../../registry/carousel.registry';

@Component({
  selector: 'demo-carousel-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, CarouselExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './carousel-detail.html',
  styleUrl: './carousel-detail.scss',
})
export class CarouselDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_LAYOUT', route: '/ui-lab/layout' },
      { title: 'UI_LAB_CAROUSEL', route: '/ui-lab/layout/carousel' },
    ],
  };

  readonly meta = CAROUSEL_META;
  readonly inputs = CAROUSEL_INPUTS;
  readonly outputs = CAROUSEL_OUTPUTS;
  readonly interfaces = CAROUSEL_INTERFACES;
  readonly examples = CAROUSEL_EXAMPLES;
}
