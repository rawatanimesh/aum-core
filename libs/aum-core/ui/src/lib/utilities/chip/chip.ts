import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'aum-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AumChipComponent {
  label = input.required<string>();
  removable = input<boolean>(false);

  removed = output<void>();

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
