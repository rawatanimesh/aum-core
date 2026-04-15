import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TabGroupComponent, TabComponent, TabLabelDirective } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'demo-tabs-examples',
  imports: [TabGroupComponent, TabComponent, TabLabelDirective, ButtonComponent, Icon, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs-examples.html',
})
export class TabsExamples {
  activeTab = signal(0);
  preserveContent = signal(false);

  readonly longList = Array.from({ length: 12 }, (_, i) => i + 1);
}
