import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { SettingsDrawerComponent } from '../components/settings-drawer/settings-drawer.component';

@Component({
  selector: 'aum-template',
  imports: [
    RouterModule,
    CommonModule,
    MatSidenavModule,
    ToolbarComponent,
    SidenavComponent,
    SettingsDrawerComponent,
  ],
  templateUrl: './aum-template.html',
  styleUrl: './aum-template.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AumTemplate {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('settingsDrawer') settingsDrawer!: MatSidenav;

  toggleSideNav(): void {
    this.settingsDrawer?.close();
    this.sidenav.toggle();
  }

  toggleSettingsDrawer(): void {
    this.sidenav?.close();
    this.settingsDrawer.toggle();
  }

  updateBreadCrumbs(event: any) {
    console.log('Breadcrumbs updated with event:', event);
  }
}
