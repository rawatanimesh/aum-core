import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RadioButton } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-radio-examples',
  imports: [RadioButton, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-examples.html',
})
export class RadioExamples {
  basicSelected   = signal('md');
  labelPosSelected = signal('md');
  disabledSelected = signal('a');

  readonly basicOptions: { label: string; value: string; selected?: boolean; disabled?: boolean }[] = [
    { label: 'Small',  value: 'sm' },
    { label: 'Medium', value: 'md', selected: true },
    { label: 'Large',  value: 'lg' },
  ];

  readonly labelBeforeOptions: { label: string; value: string; selected?: boolean; disabled?: boolean }[] = [
    { label: 'Small',  value: 'sm' },
    { label: 'Medium', value: 'md', selected: true },
    { label: 'Large',  value: 'lg' },
  ];

  readonly disabledOptions: { label: string; value: string; selected?: boolean; disabled?: boolean }[] = [
    { label: 'Available',   value: 'a', selected: true },
    { label: 'Unavailable', value: 'b', disabled: true },
    { label: 'Coming Soon', value: 'c', disabled: true },
  ];
}
