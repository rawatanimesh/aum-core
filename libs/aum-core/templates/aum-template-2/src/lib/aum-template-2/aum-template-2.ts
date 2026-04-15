import {
  Component,
  computed,
  signal,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Icon } from '@aum/ui/utilities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { AppConfigService, SideNavItem } from '@aum/utils/services';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'aum-template-2',
  imports: [
    RouterModule,
    MatSidenavModule,
    Icon,
    SidebarComponent,
    TranslateModule,
  ],
  templateUrl: './aum-template-2.html',
  styleUrl: './aum-template-2.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AumTemplate2 {
  @ViewChild('mobileDrawer') mobileDrawer!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  private appConfigService = inject(AppConfigService);

  brandLogo = this.appConfigService.brandLogo;
  appLogo = this.appConfigService.appLogo;
  appName = this.appConfigService.appName;

  /** Active L1 parent for the desktop/tablet persistent sidebar L2 panel */
  activeL1Item = signal<SideNavItem | null>(null);
  /** Active L1 parent for the mobile drawer L2 panel */
  mobileActiveL1Item = signal<SideNavItem | null>(null);

  onActiveItemChange(item: SideNavItem | null): void {
    this.activeL1Item.set(item);
  }

  onMobileActiveItemChange(item: SideNavItem | null): void {
    this.mobileActiveL1Item.set(item);
  }

  hasBrandLogo = computed(() => {
    const logo = this.brandLogo();
    return !!logo && logo.trim().length > 0;
  });

  shouldShowAppLogo = computed(() => {
    const logo = this.appLogo();
    return !!logo && logo.trim() !== '';
  });

  shouldShowAppName = computed(() => {
    const name = this.appName();
    return !this.shouldShowAppLogo() && !!name && name.trim() !== '';
  });

  constructor() {
    this.breakpointObserver
      .observe('(min-width: 961px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        if (matches) this.mobileDrawer?.close();
      });
  }
}
