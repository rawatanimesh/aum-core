import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CheckboxComponent } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-checkbox-examples',
  imports: [CheckboxComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-examples.html',
})
export class CheckboxExamples {
  agreed      = signal(false);
  notifyAfter = signal(true);
  notifyBefore = signal(false);
  indeterminate = signal(true);
  parentChecked = signal(false);
}
