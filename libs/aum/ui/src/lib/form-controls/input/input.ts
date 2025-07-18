import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'aum-input',
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'InputComponent',
})
export class InputComponent {
  @Input() label!: string;
  @Input() type: 'text' | 'color' | 'email' | 'number' | 'password' = 'text';
  @Input() value: string | number = '';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() textarea = false;
  @Input() rows = 3;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string | number>();

  onFocus() {
    // console.log('onFocus', this.value);
  }

  onBlur() {
    // console.log('onBlur', this.value);
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const newValue =
      this.type === 'number'
        ? target.value === ''
          ? ''
          : +target.value
        : target.value;
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
