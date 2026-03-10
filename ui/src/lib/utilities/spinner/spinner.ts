import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type SpinnerMode = 'page' | 'element';
export type TextPosition = 'top' | 'bottom' | 'left' | 'right';
export type SpinnerType = 'determinate' | 'indeterminate';

@Component({
  selector: 'aum-spinner',
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class Spinner {
  @Input() mode: SpinnerMode = 'element';
  @Input() type: SpinnerType = 'indeterminate';
  @Input() progress = 0;
  @Input() diameter = 50;
  @Input() text = '';
  @Input() textPosition: TextPosition = 'bottom';
  @Input() strokeWidth = 5;
  @Input() overlayOpacity = 0.9;

  get isPageMode(): boolean {
    return this.mode === 'page';
  }

  get isTextTop(): boolean {
    return this.textPosition === 'top';
  }

  get isTextBottom(): boolean {
    return this.textPosition === 'bottom';
  }

  get isTextLeft(): boolean {
    return this.textPosition === 'left';
  }

  get isTextRight(): boolean {
    return this.textPosition === 'right';
  }
}