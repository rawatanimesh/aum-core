import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-input-examples',
  imports: [InputComponent, ScenarioCard, TranslateModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-examples.html',
})
export class InputExamples {
  name    = signal('');
  email   = signal('');
  password = signal('');
  age     = signal<number | ''>('');
  message = signal('');

  readonly nameControl  = new FormControl('', [Validators.required, Validators.minLength(3)]);
  readonly emailControl = new FormControl('', [Validators.required, Validators.email]);
}
