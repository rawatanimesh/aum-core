import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-menu-list-examples',
  standalone: true,
  imports: [MenuList, ButtonComponent, MatMenuModule, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-list-examples.html',
})
export class MenuListExamples {
  lastSelected = signal<string>('—');

  basicItems: MenuItem[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Profile', value: 'profile' },
    { label: 'Reports', value: 'reports' },
  ];

  iconItems: MenuItem[] = [
    { label: 'Home', value: 'home', icon: 'home' },
    { label: 'Settings', value: 'settings', icon: 'settings' },
    { label: 'Notifications', value: 'notifications', icon: 'notifications' },
    { label: 'Help', value: 'help', icon: 'help' },
  ];

  nestedItems: MenuItem[] = [
    {
      label: 'File',
      children: [
        { label: 'New', value: 'new' },
        { label: 'Open', value: 'open' },
        { label: 'Save', value: 'save' },
      ],
    },
    {
      label: 'Edit',
      children: [
        { label: 'Cut', value: 'cut' },
        { label: 'Copy', value: 'copy' },
        { label: 'Paste', value: 'paste' },
      ],
    },
  ];

  disabledItems: MenuItem[] = [
    { label: 'Active Item', value: 'active' },
    { label: 'Disabled Item', value: 'disabled', disabled: true },
    { label: 'Another Active', value: 'another' },
  ];

  onItemSelected(item: MenuItem): void {
    this.lastSelected.set(item.label);
  }
}
