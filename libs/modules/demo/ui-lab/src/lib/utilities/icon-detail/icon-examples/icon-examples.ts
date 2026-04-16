import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icon } from '@aum/ui/utilities';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-icon-examples',
  standalone: true,
  imports: [Icon, ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-examples.html',
})
export class IconExamples {
  readonly iconNames = ['home', 'settings', 'notifications', 'favorite', 'star', 'search', 'person', 'mail'];
  currentIndex = signal(0);
  get dynamicIcon(): string { return this.iconNames[this.currentIndex()]; }
  cycleDynamic() { this.currentIndex.set((this.currentIndex() + 1) % this.iconNames.length); }
}
