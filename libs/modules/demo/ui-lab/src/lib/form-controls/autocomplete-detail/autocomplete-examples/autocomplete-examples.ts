import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Autocomplete, type SelectOption } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-autocomplete-examples',
  imports: [Autocomplete, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete-examples.html',
})
export class AutocompleteExamples {
  selectedFramework = signal<string | null>(null);
  selectedCity      = signal<string | null>(null);

  readonly frameworkOptions: SelectOption[] = [
    { value: 'ng',     text: 'Angular' },
    { value: 'react',  text: 'React' },
    { value: 'vue',    text: 'Vue' },
    { value: 'svelte', text: 'Svelte' },
    { value: 'solid',  text: 'SolidJS' },
    { value: 'next',   text: 'Next.js' },
  ];

  readonly cityOptions: SelectOption[] = [
    { value: 'tokyo',   text: 'Tokyo' },
    { value: 'london',  text: 'London' },
    { value: 'nyc',     text: 'New York' },
    { value: 'paris',   text: 'Paris' },
    { value: 'berlin',  text: 'Berlin' },
    { value: 'mumbai',  text: 'Mumbai' },
    { value: 'sydney',  text: 'Sydney' },
    { value: 'toronto', text: 'Toronto' },
  ];
}
