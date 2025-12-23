import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SideMenu, SideMenuItem  } from '@aum/ui/navigation';
import { AppConfigService } from '@aum/utils/services';

@Component({
  selector: 'aum-sidenav',
  imports: [CommonModule, SideMenu],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private router = inject(Router);
  private appConfigService = inject(AppConfigService);
  @Output() menuItemClicked = new EventEmitter();
  isDataLoaded = true;

  // Get navigation items from config service
  get navItems(): SideMenuItem [] {
    return this.appConfigService.config.navItems;
  }

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
