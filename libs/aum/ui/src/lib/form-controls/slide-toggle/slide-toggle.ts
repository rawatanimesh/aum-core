import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * @title Basic slide-toggle
 */
@Component({
  selector: 'aum-slide-toggle',
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.scss',
  imports: [MatSlideToggleModule],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'SlideToggle',
})
export class SlideToggle {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() toggled = new EventEmitter();

  changeValue(event: any) {
    this.checkedChange.emit(event.checked);
    this.toggled.emit(event);
  }
}
