import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonComponent } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'demo-page-examples',
  imports: [ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-examples.html',
})
export class PageExamples {
  readonly drawerToggle = output<void>();
}
