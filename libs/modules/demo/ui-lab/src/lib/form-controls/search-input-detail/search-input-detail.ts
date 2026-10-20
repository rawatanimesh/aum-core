import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { SearchInputExamples } from './search-input-examples/search-input-examples';
import {
  SEARCH_INPUT_META,
  SEARCH_INPUT_INPUTS,
  SEARCH_INPUT_OUTPUTS,
  SEARCH_INPUT_EXAMPLES,
} from '../../registry/search-input.registry';

@Component({
  selector: 'demo-search-input-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, SearchInputExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-input-detail.html',
  styleUrl: '../input-detail/input-detail.scss',
})
export class SearchInputDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_SEARCH_INPUT', route: '/ui-lab/form-controls/search-input' },
    ],
  };

  readonly meta = SEARCH_INPUT_META;
  readonly inputs = SEARCH_INPUT_INPUTS;
  readonly outputs = SEARCH_INPUT_OUTPUTS;
  readonly examples = SEARCH_INPUT_EXAMPLES;
}
