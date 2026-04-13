import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type IconLibrary = 'material'; // extend later: | 'icomoon'

export type IconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'on-surface'
  | 'on-surface-variant';

const COLOR_MAP: Record<IconColor, string> = {
  'primary': 'var(--mat-sys-primary)',
  'secondary': 'var(--mat-sys-secondary)',
  'tertiary': 'var(--mat-sys-tertiary)',
  'error': 'var(--mat-sys-error)',
  'on-surface': 'var(--mat-sys-on-surface)',
  'on-surface-variant': 'var(--mat-sys-on-surface-variant)',
};

@Component({
  selector: 'aum-icon',
  templateUrl: './icon.html',
  styleUrls: ['./icon.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class Icon {
  @Input({ required: true }) name!: string;
  @Input() library: IconLibrary = 'material';
  /** Override width in px — defaults to 24, converted to rem with --ui-scale applied */
  @Input() width?: number;
  /** Override height in px — defaults to 24, converted to rem with --ui-scale applied */
  @Input() height?: number;
  /**
   * Override icon color. Accepts:
   * - A preset token name ('primary', 'error', etc.) → mapped to the corresponding --mat-sys-* variable
   * - Any raw CSS color value ('red', '#ff0000', 'rgb(255,0,0)') → used directly
   * Omit to inherit color from the parent element (default — recommended for most cases).
   */
  @Input() color?: IconColor | string;
  /** Provide for standalone icons; omit to mark as aria-hidden (decorative) */
  @Input() ariaLabel?: string;

  get iconStyles(): { [key: string]: string } | null {
    const styles: { [key: string]: string } = {};

    if (this.width || this.height) {
      const toRemScale = (px: number): string =>
        `calc((${px} / 16) * 1rem * var(--ui-scale))`;

      const w = this.width ?? this.height ?? 24;
      const h = this.height ?? this.width ?? 24;

      styles['font-size'] = toRemScale(w);
      styles['width'] = toRemScale(w);
      styles['height'] = toRemScale(h);
      styles['line-height'] = '1';
    }

    if (this.color) {
      styles['color'] = this.color in COLOR_MAP
        ? COLOR_MAP[this.color as IconColor]
        : this.color;
    }

    return Object.keys(styles).length > 0 ? styles : null;
  }
}
