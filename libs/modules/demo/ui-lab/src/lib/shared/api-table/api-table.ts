import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

@Component({
  selector: 'ui-lab-api-table',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-table.html',
  styleUrl: './api-table.scss',
})
export class ApiTable {
  @Input() inputs: ApiRow[] = [];
  @Input() outputs: ApiRow[] = [];
  @Input() interfaces: { name: string; definition: string }[] = [];
}
