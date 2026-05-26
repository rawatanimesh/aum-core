import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
  signal,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SettingsDrawerComponent } from '@aum/templates/aum-template';
import { Sidebar3Component } from '../components/sidebar/sidebar3.component';

@Component({
  selector: 'aum-template-3',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    ToolbarComponent,
    SettingsDrawerComponent,
    Sidebar3Component,
  ],
  templateUrl: './aum-template-3.html',
  styleUrl: './aum-template-3.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AumTemplate3 {
  @ViewChild('mobileDrawer') mobileDrawer!: MatSidenav;
  @ViewChild('settingsDrawer') settingsDrawer!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);

  /** True when the desktop persistent sidebar is expanded */
  readonly sidebarExpanded = signal(false);

  /** True when the current viewport is desktop (≥961px) */
  readonly isDesktop = signal(false);

  constructor() {
    this.breakpointObserver
      .observe('(min-width: 961px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.isDesktop.set(matches);
        if (matches) this.mobileDrawer?.close();
      });
  }

  /**
   * Toolbar hamburger handler.
   * Desktop: toggle the persistent sidebar expand.
   * Mobile/Tablet: toggle the overlay drawer.
   */
  onSideMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarExpanded.set(!this.sidebarExpanded());
    } else {
      this.settingsDrawer?.close();
      this.mobileDrawer?.toggle();
    }
  }

  toggleSettingsDrawer(): void {
    this.mobileDrawer?.close();
    this.settingsDrawer?.toggle();
  }

  closeSideNavs(): void {
    this.mobileDrawer?.close();
    this.settingsDrawer?.close();
  }
}
