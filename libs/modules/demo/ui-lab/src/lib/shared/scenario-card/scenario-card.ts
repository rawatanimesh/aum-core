import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-lab-scenario-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scenario-card.html',
  styleUrl: './scenario-card.scss',
})
export class ScenarioCard {
  @Input() title = '';
  @Input() description = '';
}
