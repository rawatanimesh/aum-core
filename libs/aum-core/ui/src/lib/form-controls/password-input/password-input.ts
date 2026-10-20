import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { InputComponent } from '../input/input';

@Component({
  selector: 'aum-password-input',
  imports: [InputComponent],
  template: `
    <aum-input
      [label]="label"
      [required]="required"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [maxlength]="maxlength"
      [size]="size"
      [boldLabel]="boldLabel"
      [control]="control"
      [data]="data"
      [customErrorMessages]="customErrorMessages"
      [type]="showPassword ? 'text' : 'password'"
      suffixIcon="visibility"
      suffixIconActive="visibility_off"
      [suffixIconToggled]="showPassword"
      (suffixClick)="toggleVisibility()"
      (dataChange)="dataChange.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PasswordInputComponent extends InputComponent {
  showPassword = false;

  toggleVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
