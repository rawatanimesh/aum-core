import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ExpansionPanel, ExpansionPanelItem, ExpansionPanelContentDirective } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { CheckboxComponent, InputComponent } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'demo-expansion-panel-examples',
  imports: [ExpansionPanel, ExpansionPanelContentDirective, ButtonComponent, CheckboxComponent, InputComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expansion-panel-examples.html',
})
export class ExpansionPanelExamples {
  @ViewChild('multiPanel') multiPanel!: ExpansionPanel;

  readonly basicItems: ExpansionPanelItem[] = [
    { header: 'What is AUM?', content: 'AUM is an Angular component library built on Material Design 3.' },
    { header: 'How do I install it?', content: 'Add @aum/ui to your package.json and import the desired modules.' },
    { header: 'Is it production ready?', content: 'Yes — AUM is used in production applications today.' },
  ];

  readonly multiItems: ExpansionPanelItem[] = [
    { header: 'Step 1 — Setup', content: 'Install the package and configure your Angular app.', expanded: true },
    { header: 'Step 2 — Import', content: 'Import the required modules in your component.', expanded: true },
    { header: 'Step 3 — Use', content: 'Add the component selector to your template.' },
  ];

  readonly projectionItems: ExpansionPanelItem[] = [
    { header: 'Action Buttons', expanded: true },
    { header: 'Checkboxes' },
    { header: 'Form Inputs' },
  ];

  readonly defaultExpandedItems: ExpansionPanelItem[] = [
    { header: 'Open by default', content: 'This panel starts in the expanded state.', expanded: true },
    { header: 'Closed by default', content: 'This panel starts collapsed.' },
    { header: 'Also closed', content: 'Another collapsed panel.' },
  ];

  readonly disabledItems: ExpansionPanelItem[] = [
    { header: 'Active panel', content: 'This panel can be toggled freely.' },
    { header: 'Locked panel (disabled)', content: 'This panel cannot be expanded.', disabled: true },
    { header: 'Another active panel', content: 'Also freely togglable.' },
  ];

  expandAll() { this.multiPanel?.expandAll(); }
  collapseAll() { this.multiPanel?.collapseAll(); }
}
