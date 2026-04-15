import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-lab-component-header',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-header.html',
  styleUrl: './component-header.scss',
})
export class ComponentHeader {
  @Input() name = '';
  @Input() selector = '';
  @Input() importFrom = '';
  @Input() description = '';
  @Input() status: 'stable' | 'beta' | 'experimental' = 'stable';
}
