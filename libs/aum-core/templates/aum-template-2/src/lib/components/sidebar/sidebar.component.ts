import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import {
  AppConfigService,
  AppEventBusService,
  AppEventType,
  AuthService,
  LanguageTranslationService,
  MenuConfigHelper,
} from '@aum/utils/services';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { PreferencesDialogService } from '@aum/common';
import { ToolbarAction, ToolbarContentService } from '@aum/templates/aum-template';

@Component({
  selector: 'aum-sidebar-2',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MenuList,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() showBrandLogo = true;
  @Input() showAppIdentity = true;
  @Output() menuItemClicked = new EventEmitter();

  private appConfigService = inject(AppConfigService);
  private languageService = inject(LanguageTranslationService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private router = inject(Router);
  private eventBus = inject(AppEventBusService);
  private toolbarContentService = inject(ToolbarContentService);
  private preferencesDialogService = inject(PreferencesDialogService);

  navItems = this.appConfigService.navItems;
  brandLogo = this.appConfigService.brandLogo;
  appLogo = this.appConfigService.appLogo;
  appName = this.appConfigService.appName;
  toolbarMenusConfig = this.appConfigService.toolbarMenus;

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

  protected shouldShowPreferencesMenu = computed(() =>
    MenuConfigHelper.shouldShowPreferencesMenu(this.toolbarMenusConfig())
  );
  protected isPreferencesMenuDisabled = computed(() =>
    MenuConfigHelper.isPreferencesMenuDisabled(this.toolbarMenusConfig())
  );
  protected shouldShowProfileMenu = computed(() =>
    MenuConfigHelper.shouldShowProfileMenu(this.toolbarMenusConfig())
  );
  protected isProfileMenuDisabled = computed(() =>
    MenuConfigHelper.isProfileMenuDisabled(this.toolbarMenusConfig())
  );

  profileMenuList: MenuItem[] = [];
  globalActions: ToolbarAction[] = [];

  private menusInitialized = false;

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      if (this.menusInitialized) {
        this.buildProfileMenu();
        this.cdr.markForCheck();
      }
    });

    this.languageService.get('LANGUAGE')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.buildProfileMenu();
        this.menusInitialized = true;
        this.cdr.markForCheck();
      });

    this.toolbarContentService
      .getGlobalActions()
      .pipe(takeUntilDestroyed())
      .subscribe((actions) => {
        this.globalActions = actions;
        this.cdr.markForCheck();
      });
  }

  private buildProfileMenu(): void {
    const config = this.toolbarMenusConfig();
    const items: MenuItem[] = [];

    if (MenuConfigHelper.shouldShowProfileItem(config, 'profile')) {
      items.push({
        label: this.languageService.instant('AUM.PROFILE'),
        value: 'profile',
        icon: 'person',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'profile'),
        showSelection: false,
      });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'settings')) {
      items.push({
        label: this.languageService.instant('AUM.SETTINGS'),
        value: 'settings',
        icon: 'settings',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'settings'),
        showSelection: false,
      });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'logout')) {
      items.push({
        label: this.languageService.instant('AUM.LOGOUT'),
        value: 'logout',
        icon: 'logout',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'logout'),
        showSelection: false,
      });
    }

    this.profileMenuList = items;
  }

  onItemClick(value: string): void {
    this.router.navigateByUrl(value).then((success) => {
      if (success) this.menuItemClicked.emit();
    });
  }

  onMenuSelect(item: MenuItem): void {
    if (item.value === 'logout') {
      this.logout();
    }
  }

  onMenuOpening(): void {
    if (this.menusInitialized) {
      this.buildProfileMenu();
    }
  }

  openPreferences(): void {
    this.preferencesDialogService.open();
  }

  onGlobalActionClick(actionId: string): void {
    this.toolbarContentService.executeAction(actionId);
  }

  logout(): void {
    this.eventBus.emit(AppEventType.LOGOUT);
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
