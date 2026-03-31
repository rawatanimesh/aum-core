import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {
  AppConfigService,
  MenuConfigHelper,
  ThemeService,
  LanguageTranslationService,
  AuthService,
} from '@aum/utils/services';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';
import { SnackbarService } from '@aum/ui/utilities';
import {
  AppEventBusService,
  AppEventType,
  ToolbarContentService,
  ToolbarAction,
} from '@aum/templates/aum-template';

@Component({
  selector: 'aum-sidebar-2',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    ButtonComponent,
    MenuList,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  /** When false, hides the brand logo from the sidebar header (e.g. mobile drawer where it's already in the top bar) */
  @Input() showBrandLogo = true;
  /** When false, hides the app logo/name from the sidebar header (e.g. mobile drawer where it's already in the top bar) */
  @Input() showAppIdentity = true;

  @Output() menuItemClicked = new EventEmitter();

  private appConfigService = inject(AppConfigService);
  protected themeService = inject(ThemeService);
  protected languageService = inject(LanguageTranslationService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private eventBus = inject(AppEventBusService);
  private toolbarContentService = inject(ToolbarContentService);

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

  private menusInitialized = false;
  private langSubscription?: Subscription;
  private globalActionsSubscription?: Subscription;

  optionsMenuList: MenuItem[] = [];
  profileMenuList: MenuItem[] = [];
  globalActions: ToolbarAction[] = [];

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      if (this.menusInitialized) {
        this.cdr.markForCheck();
      }
    });
  }

  buildMenus(): void {
    const config = this.toolbarMenusConfig();
    const preferencesMenuItems: MenuItem[] = [];

    if (MenuConfigHelper.shouldShowPreferencesItem(config, 'language')) {
      preferencesMenuItems.push({
        label: this.languageService.instant('LANGUAGE'),
        value: 'language',
        icon: 'language',
        disabled: MenuConfigHelper.isPreferencesItemDisabled(config, 'language'),
        children: [
          { label: 'English', value: 'en', selected: this.languageService.getLanguage() === 'en' },
          { label: '日本語 (Japanese)', value: 'ja', selected: this.languageService.getLanguage() === 'ja' },
          { label: 'हिन्दी (Hindi)', value: 'hi', selected: this.languageService.getLanguage() === 'hi' },
        ],
      });
    }

    if (MenuConfigHelper.shouldShowPreferencesItem(config, 'theme')) {
      const savedTheme = localStorage.getItem('app-theme-mode') || this.appConfigService.defaults()?.theme || 'light';
      preferencesMenuItems.push({
        label: this.languageService.instant('THEME'),
        value: 'theme',
        icon: 'contrast',
        disabled: MenuConfigHelper.isPreferencesItemDisabled(config, 'theme'),
        children: [
          { label: this.languageService.instant('LIGHT'), value: 'light', icon: 'light_mode', selected: savedTheme === 'light' },
          { label: this.languageService.instant('DARK'), value: 'dark', icon: 'dark_mode', selected: savedTheme === 'dark' },
          { label: this.languageService.instant('SYSTEM'), value: 'system', icon: 'computer', selected: savedTheme === 'system' },
        ],
      });
    }

    // Template switcher
    if (MenuConfigHelper.shouldShowPreferencesItem(config, 'template')) {
      const savedTemplate = localStorage.getItem('app-template') || this.appConfigService.defaults()?.template || 'template-2';
      preferencesMenuItems.push({
        label: this.languageService.instant('TEMPLATE'),
        value: 'template',
        icon: 'dashboard_customize',
        disabled: MenuConfigHelper.isPreferencesItemDisabled(config, 'template'),
        children: [
          { label: this.languageService.instant('TEMPLATE_1'), value: 'template-1', icon: 'view_sidebar', selected: savedTemplate === 'template-1' },
          { label: this.languageService.instant('TEMPLATE_2'), value: 'template-2', icon: 'view_compact', selected: savedTemplate === 'template-2' },
        ],
      });
    }

    const savedMode = localStorage.getItem('ui-scale-mode') || this.appConfigService.defaults()?.displayMode || 'default';
    preferencesMenuItems.push({
      label: this.languageService.instant('DISPLAY'),
      value: 'mode',
      icon: 'aspect_ratio',
      disabled: MenuConfigHelper.isPreferencesMenuDisabled(config),
      children: [
        { label: this.languageService.instant('COMPACT'), value: 'compact', icon: 'density_small', selected: savedMode === 'compact' },
        { label: this.languageService.instant('DEFAULT'), value: 'default', icon: 'density_medium', selected: savedMode === 'default' },
        { label: this.languageService.instant('LARGE'), value: 'large', icon: 'density_large', selected: savedMode === 'large' },
      ],
    });
    this.optionsMenuList = preferencesMenuItems;

    const profileMenuItems: MenuItem[] = [];
    if (MenuConfigHelper.shouldShowProfileItem(config, 'profile')) {
      profileMenuItems.push({ label: this.languageService.instant('PROFILE'), value: 'profile', icon: 'person', disabled: MenuConfigHelper.isProfileItemDisabled(config, 'profile'), showSelection: false });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'settings')) {
      profileMenuItems.push({ label: this.languageService.instant('SETTINGS'), value: 'settings', icon: 'settings', disabled: MenuConfigHelper.isProfileItemDisabled(config, 'settings'), showSelection: false });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'logout')) {
      profileMenuItems.push({ label: this.languageService.instant('LOGOUT'), value: 'logout', icon: 'logout', disabled: MenuConfigHelper.isProfileItemDisabled(config, 'logout'), showSelection: false });
    }
    this.profileMenuList = profileMenuItems;
  }

  ngOnInit() {
    this.langSubscription = this.languageService.get('LANGUAGE').subscribe(() => {
      this.buildMenus();
      this.menusInitialized = true;
      this.cdr.markForCheck();

      const savedMode = localStorage.getItem('ui-scale-mode') as 'compact' | 'default' | 'large';
      if (savedMode) document.body.classList.add(`scale-${savedMode}`);
      this.setMenuSelection(this.optionsMenuList, 'mode', savedMode || this.appConfigService.defaults()?.displayMode || 'default');

      const savedTheme = localStorage.getItem('app-theme-mode') as 'light' | 'dark' | 'system';
      this.setMenuSelection(this.optionsMenuList, 'theme', savedTheme || this.appConfigService.defaults()?.theme || 'light');
    });

    this.globalActionsSubscription = this.toolbarContentService
      .getGlobalActions()
      .subscribe((actions) => {
        this.globalActions = actions;
        this.cdr.markForCheck();
      });
  }

  onItemClick(value: string) {
    this.router.navigateByUrl(value).then((success) => {
      if (success) this.menuItemClicked.emit();
    });
  }

  onMenuSelect(item: MenuItem) {
    if (item.value === 'template-1' || item.value === 'template-2') {
      localStorage.setItem('app-template', item.value);
      this.setMenuSelection(this.optionsMenuList, 'template', item.value);
      this.eventBus.emit(AppEventType.TEMPLATE_CHANGED, { template: item.value });
    }
    if (item.value === 'compact' || item.value === 'default' || item.value === 'large') {
      this.setUiScale(item.value);
      this.setMenuSelection(this.optionsMenuList, 'mode', item.value);
    }
    if (item.value === 'light' || item.value === 'dark' || item.value === 'system') {
      const previousTheme = this.themeService.getTheme();
      this.themeService.setTheme(item.value);
      this.setMenuSelection(this.optionsMenuList, 'theme', item.value);
      this.eventBus.emit(AppEventType.THEME_CHANGED, { theme: item.value, previousTheme });
    }
    if (item.value === 'en' || item.value === 'ja' || item.value === 'hi') {
      const currentLanguage = this.languageService.getLanguage();
      if (currentLanguage !== item.value) {
        this.languageService.setLanguage(item.value);
        this.setMenuSelection(this.optionsMenuList, 'language', item.value);
        this.eventBus.emit(AppEventType.LANGUAGE_CHANGED, { language: item.value, previousLanguage: currentLanguage });
        setTimeout(() => {
          this.snackbarService.success(this.languageService.instant('LANGUAGE_CHANGED_SUCCESSFULLY'), 3000);
        }, 100);
      }
    }
    if (item.value === 'logout') {
      this.logout();
    }
  }

  setMenuSelection(menuList: MenuItem[], parent: string, value: string) {
    const parentMenu = menuList.find((m) => m.value === parent);
    if (parentMenu?.children) {
      parentMenu.children.forEach((child) => { child.selected = child.value === value; });
    }
  }

  onMenuOpening(): void {
    if (this.menusInitialized) this.buildMenus();
  }

  onGlobalActionClick(actionId: string): void {
    this.toolbarContentService.executeAction(actionId);
  }

  setUiScale(mode: 'compact' | 'default' | 'large') {
    const previousScale = (localStorage.getItem('ui-scale-mode') || 'default') as 'compact' | 'default' | 'large';
    const body = document.body;
    body.classList.remove('scale-compact', 'scale-large', 'scale-default');
    body.classList.add(`scale-${mode}`);
    localStorage.setItem('ui-scale-mode', mode);
    this.eventBus.emit(AppEventType.UI_SCALE_CHANGED, { scale: mode, previousScale });
  }

  logout() {
    this.eventBus.emit(AppEventType.LOGOUT);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
    this.globalActionsSubscription?.unsubscribe();
  }
}
