import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-button-examples',
  imports: [ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-examples.html',
})
export class ButtonExamples {
  lastClicked = signal('');

  onClick(label: string): void {
    this.lastClicked.set(label);
  }
}
