import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PasswordInputComponent, SlideToggle } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-password-input-examples',
  imports: [PasswordInputComponent, SlideToggle, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-input-examples.html',
})
export class PasswordInputExamples {
  password = signal('');

  boldLabel = signal(true);
  size = signal<'medium' | 'large'>('medium');

  readonly passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
}
