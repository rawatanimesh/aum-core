import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent, TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentHeader } from '../../shared/component-header/component-header';
import { ApiTable } from '../../shared/api-table/api-table';
import { CodeBlock } from '../../shared/code-block/code-block';
import { AutocompleteExamples } from './autocomplete-examples/autocomplete-examples';
import { AUTOCOMPLETE_META, AUTOCOMPLETE_INPUTS, AUTOCOMPLETE_OUTPUTS, AUTOCOMPLETE_EXAMPLES } from '../../registry/autocomplete.registry';

@Component({
  selector: 'demo-autocomplete-detail',
  imports: [RouterModule, PageComponent, TabGroupComponent, TabComponent, Icon, TranslateModule, ComponentHeader, ApiTable, CodeBlock, AutocompleteExamples],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete-detail.html',
  styleUrl: './autocomplete-detail.scss',
})
export class AutocompleteDetail {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
      { title: 'UI_LAB_AUTOCOMPLETE', route: '/ui-lab/form-controls/autocomplete' },
    ],
  };

  readonly meta = AUTOCOMPLETE_META;
  readonly inputs = AUTOCOMPLETE_INPUTS;
  readonly outputs = AUTOCOMPLETE_OUTPUTS;
  readonly examples = AUTOCOMPLETE_EXAMPLES;
}
