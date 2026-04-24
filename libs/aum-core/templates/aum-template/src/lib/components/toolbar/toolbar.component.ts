import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { BreadcrumbComponent } from '@aum/ui/navigation';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';
import { PreferencesDialogService } from '@aum/common';
import { ToolbarContentService, ToolbarAction, ToolbarCustomTemplate } from '../../services/toolbar-content.service';

@Component({
  selector: 'aum-toolbar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    BreadcrumbComponent,
    ButtonComponent,
    MenuList,
    TranslateModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Output() sideMenuToggle = new EventEmitter();
  @Output() settingsDrawerToggle = new EventEmitter();

  private appConfigService = inject(AppConfigService);
  private languageService = inject(LanguageTranslationService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private eventBus = inject(AppEventBusService);
  private toolbarContentService = inject(ToolbarContentService);
  private destroyRef = inject(DestroyRef);
  private preferencesDialogService = inject(PreferencesDialogService);

  brandLogo = this.appConfigService.brandLogo;
  appLogo = this.appConfigService.appLogo;
  appName = this.appConfigService.appName;
  logoHomeRoute = this.appConfigService.logoHomeRoute;
  toolbarMenusConfig = this.appConfigService.toolbarMenus;

  protected hasBrandLogo = computed(() => {
    const logo = this.brandLogo();
    return logo && logo.trim().length > 0;
  });

  protected shouldShowAppLogo = computed(() => {
    const logo = this.appLogo();
    return !!logo && logo.trim() !== '';
  });

  protected shouldShowAppName = computed(() => {
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
  toolbarActions: ToolbarAction[] = [];
  overflowActions: ToolbarAction[] = [];
  overflowMenuList: MenuItem[] = [];
  customTemplates: ToolbarCustomTemplate[] = [];

  private menusInitialized = false;

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      if (this.menusInitialized) {
        this.buildProfileMenu();
        this.cdr.markForCheck();
      }
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

  private buildOverflowMenuList(): void {
    this.overflowMenuList = this.overflowActions.map((action) => ({
      label: this.languageService.instant(action.tooltip || ''),
      value: action.id,
      icon: action.icon,
      showSelection: false,
    }));
  }

  ngOnInit(): void {
    this.languageService.get('LANGUAGE')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.buildProfileMenu();
        this.menusInitialized = true;
        this.cdr.markForCheck();
      });

    this.toolbarContentService.getGlobalActions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((actions) => {
        this.toolbarActions = actions.filter((a) => !a.overflow);
        this.overflowActions = actions.filter((a) => a.overflow);
        this.buildOverflowMenuList();
        this.cdr.markForCheck();
      });

    this.toolbarContentService.getCustomTemplates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((templates) => {
        this.customTemplates = templates;
        this.cdr.markForCheck();
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

  navigateHome(): void {
    const route = this.logoHomeRoute();
    if (route) {
      this.router.navigate([route]);
    }
  }

  toggleMenu(): void {
    this.sideMenuToggle.emit();
  }

  openSettingsDrawer(): void {
    this.settingsDrawerToggle.emit();
  }

  logout(): void {
    this.eventBus.emit(AppEventType.LOGOUT);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onGlobalActionClick(actionId: string): void {
    this.toolbarContentService.executeAction(actionId);
  }

  onOverflowMenuSelect(item: MenuItem): void {
    this.toolbarContentService.executeAction(item.value as string);
  }
}
