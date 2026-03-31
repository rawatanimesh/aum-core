import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppConfigService } from '@aum/utils/services';
import { SideMenu } from '../side-menu/side-menu';

@Component({
  selector: 'aum-sidenav',
  imports: [CommonModule, SideMenu],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private appConfigService = inject(AppConfigService);

  @Output() menuItemClicked = new EventEmitter();

  navItems = this.appConfigService.navItems;
  selectedItem = '';

  onNavItemSelect(item: any) {
    this.selectedItem = item.value;
  }

  onRouteChange(item: any) {
    this.menuItemClicked.emit();
  }
}
