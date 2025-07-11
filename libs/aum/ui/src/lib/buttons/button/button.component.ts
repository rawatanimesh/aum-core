import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'aum-button',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ButtonComponent',
})
export class ButtonComponent {
  @Input() type: 'outlined' | 'filled' | 'basic' | 'icon' = 'filled';
  @Input() size: 'small' | 'large' = 'large';
  @Input() value = '';
  @Input() icon = ''; // for icon name
  @Input() disabled = false;
  @Input() tooltip = '';
  @Output() clickButton = new EventEmitter<MouseEvent>();

  get sizeClass() {
    return {
      'aum-button-large': this.size === 'large',
      'aum-button-small': this.size === 'small',
    };
  }
}
