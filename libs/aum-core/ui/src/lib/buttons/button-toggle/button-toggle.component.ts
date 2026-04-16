import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Icon } from '../../utilities/icon/icon';

export interface ButtonToggleOption {
  label: string;
  value: string;
  selected?: boolean;
  icon?: string;
}

@Component({
  selector: 'aum-button-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, Icon],
  templateUrl: './button-toggle.component.html',
  styleUrl: './button-toggle.component.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ButtonToggleComponent',
})
export class ButtonToggleComponent implements OnInit {
  @Input() options: ButtonToggleOption[] = [];
  @Input() multiple = false;
  @Input() size: 'small' | 'large' = 'large';
  @Input() disabled = false;
  @Input() ariaLabel = '';
  @Output() selectionChange = new EventEmitter<string | string[]>();

  // Stable property — not a getter. Avoids re-setting the toggle group
  // on every change detection cycle (which would happen with a getter returning
  // a new array reference each time, causing multiple-selection to reset).
  currentValue: string | string[] = '';

  ngOnInit(): void {
    this.currentValue = this.multiple
      ? this.options.filter((o) => o.selected).map((o) => o.value)
      : (this.options.find((o) => o.selected)?.value ?? '');
  }

  onToggleChange(value: string | string[]): void {
    this.currentValue = value;
    this.selectionChange.emit(value);
  }

  get sizeClass() {
    return {
      'aum-button-toggle-large': this.size === 'large',
      'aum-button-toggle-small': this.size === 'small',
    };
  }
}
