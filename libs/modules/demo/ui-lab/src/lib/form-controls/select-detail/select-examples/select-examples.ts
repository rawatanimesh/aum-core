import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SelectBox, type SelectOption } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-select-examples',
  imports: [SelectBox, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-examples.html',
})
export class SelectExamples {
  country       = signal<string | null>(null);
  selectedTags  = signal<string[]>([]);
  status        = signal<string | null>(null);

  readonly countryOptions: SelectOption[] = [
    { value: 'us', text: 'United States' },
    { value: 'gb', text: 'United Kingdom' },
    { value: 'jp', text: 'Japan' },
    { value: 'de', text: 'Germany' },
    { value: 'in', text: 'India' },
  ];

  readonly tagOptions: SelectOption[] = [
    { value: 'angular', text: 'Angular' },
    { value: 'ts',      text: 'TypeScript' },
    { value: 'scss',    text: 'SCSS' },
    { value: 'nx',      text: 'NX' },
    { value: 'material', text: 'Material Design' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: 'active',  text: 'Active' },
    { value: 'retired', text: 'Retired',     disabled: true },
    { value: 'soon',    text: 'Coming Soon', disabled: true },
  ];
}
