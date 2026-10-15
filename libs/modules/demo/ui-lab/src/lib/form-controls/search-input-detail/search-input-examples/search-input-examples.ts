import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SearchInputComponent, SlideToggle } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-search-input-examples',
  imports: [SearchInputComponent, SlideToggle, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-input-examples.html',
})
export class SearchInputExamples {
  submitted = signal('');
  debounced = signal('');

  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Papaya'];
  query = signal('');
  filtered = computed(() =>
    this.fruits.filter((fruit) => fruit.toLowerCase().includes(this.query().toLowerCase()))
  );

  boldLabel = signal(true);
  size = signal<'medium' | 'large'>('medium');
}
