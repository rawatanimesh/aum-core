import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aum-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  exportAs: 'CardComponent',
})
export class CardComponent {
  @Input() padding = true;
  @Input() boxShadow = true;
  @Input() height = 'auto';
  @Input() width = '21.875em';
}
