import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'aum-radio-button',
  imports: [CommonModule, MatRadioModule],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'RadioButtonComponent',
})
export class RadioButton {
  @Input() options: {
    label: string;
    value: any;
    selected?: boolean;
    disabled?: boolean;
  }[] = [];
  @Input() labelPosition: 'before' | 'after' = 'after';

  @Output() selectionChange = new EventEmitter<{
    label: string;
    value: any;
    selected: boolean;
    disabled?: boolean;
  }>();

  get selectedValue(): any {
    return this.options.find((opt) => opt.selected)?.value;
  }

  onChange(event: MatRadioChange) {
    const updatedOptions = this.options.map((opt) => ({
      ...opt,
      selected: opt.value === event.value,
    }));

    const selected = updatedOptions.find((opt) => opt.selected);
    if (selected) {
      this.selectionChange.emit(selected);
    }
  }
}
