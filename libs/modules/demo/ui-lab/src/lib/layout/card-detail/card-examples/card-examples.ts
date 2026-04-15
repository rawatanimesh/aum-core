import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '@aum/ui/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'demo-card-examples',
  imports: [CardComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-examples.html',
})
export class CardExamples {}
