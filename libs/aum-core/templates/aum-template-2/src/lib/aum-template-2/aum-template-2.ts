import {
  Component,
  computed,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Icon } from '@aum/ui/utilities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppConfigService } from '@aum/utils/services';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'aum-template-2',
  imports: [
    RouterModule,
    MatSidenavModule,
    Icon,
    SidebarComponent,
  ],
  templateUrl: './aum-template-2.html',
  styleUrl: './aum-template-2.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AumTemplate2 {
  /** Width of the mobile slide-out drawer. Accepts any valid CSS width value (e.g. '240px', '80vw'). Defaults to '200px'. */
  @Input() drawerWidth = '200px';

  @ViewChild('mobileDrawer') mobileDrawer!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  private appConfigService = inject(AppConfigService);

  brandLogo = this.appConfigService.brandLogo;
  appLogo = this.appConfigService.appLogo;
  appName = this.appConfigService.appName;

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
      .observe('(min-width: 700px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        if (matches) this.mobileDrawer?.close();
      });
  }
}
