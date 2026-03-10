import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCheckboxModule,
  MatCheckboxChange,
} from '@angular/material/checkbox';

@Component({
  selector: 'aum-checkbox',
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'CheckboxComponent',
})
export class CheckboxComponent {
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() disabled = false;
  @Input() label = '';
  @Input() labelPosition: 'before' | 'after' = 'after';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() indeterminateChange = new EventEmitter<boolean>();

  onChange(event: MatCheckboxChange) {
    this.checkedChange.emit(event.checked);
  }

  onIndeterminateChange(value: boolean) {
    this.indeterminateChange.emit(value);
  }
}
