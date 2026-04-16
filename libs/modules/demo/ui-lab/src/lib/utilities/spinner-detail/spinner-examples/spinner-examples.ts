import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Spinner } from '@aum/ui/utilities';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-spinner-examples',
  standalone: true,
  imports: [Spinner, ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner-examples.html',
})
export class SpinnerExamples {
  progress = signal(65);
  increaseProgress() { this.progress.set(Math.min(100, this.progress() + 10)); }
  resetProgress() { this.progress.set(0); }
}
