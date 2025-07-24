import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SideMenu, SideMenuItem } from '@aum/ui/navigation';

@Component({
  selector: 'aum-sidenav',
  imports: [CommonModule, SideMenu],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private router = inject(Router);
  @Output() menuItemClicked = new EventEmitter();
  isDataLoaded = true;
  currentMenu = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      route: 'dashboard',
      // icon: 'side-panel-icon-v2 side-panel-icondashboard',
      // rule: ['trainee', 'admin'],
      // description: 'Browse all available learning material',
    },
    {
      name: 'playground',
      title: 'Playground',
      route: 'playground',
    },
  ];

  navItems: SideMenuItem[] = [
    {
      label: 'Dashboard',
      value: '/dashboard',
      icon: 'dashboard',
      selected: true,
    },
    {
      label: 'Agent Directory',
      value: 'agent-directory',
      icon: 'support_agent',
      expanded: false,
      children: [
        {
          label: 'My Agents',
          value: '/agent-directory/my-agents',
          icon: 'adb',
        },
        {
          label: 'Agent List',
          value: '/agent-directory/agent-list',
          icon: 'smart_toy',
        },
      ],
    },
    {
      label: 'Playground',
      value: '/playground',
      icon: 'close',
      selected: false,
    },
  ];
  selectedItem = '';

  onNavItemSelect(item: any) {
    this.selectedItem = item.value;
    console.log('Selected:', item);
  }
  onRouteChange(item: any) {
    console.log('Route changed, closing sidenav');
    this.menuItemClicked.emit();
  }
}
