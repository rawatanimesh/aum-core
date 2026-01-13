import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService, AppConfigService, LanguageTranslationService, MenuConfigHelper } from '@aum/utils/services';
import { BreadcrumbService } from '@aum/ui/navigation';
import { BreadcrumbComponent } from '@aum/ui/navigation';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';
import { SnackbarService } from '@aum/ui/utilities';
import { AuthService } from '@aum/utils/services';

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
  protected themeService = inject(ThemeService);
  protected breadcrumbService = inject(BreadcrumbService);
  protected appConfigService = inject(AppConfigService);
  protected languageService = inject(LanguageTranslationService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackbarService = inject(SnackbarService);

  // Computed signals for reactive config
  themeIcon = computed(() => this.themeService.themeIcon());
  brandLogo = this.appConfigService.brandLogo;
  appLogo = this.appConfigService.appLogo;
  appName = this.appConfigService.appName;
  toolbarMenusConfig = this.appConfigService.toolbarMenus;

  // Check if appLogo should be shown (has a valid non-empty path)
  shouldShowAppLogo = computed(() => {
    const logo = this.appLogo();
    return !!logo && logo.trim() !== '';
  });

  // Check if appName should be shown (only when logo is not available)
  shouldShowAppName = computed(() => {
    const name = this.appName();
    return !this.shouldShowAppLogo() && !!name && name.trim() !== '';
  });

  // Helper for checking menu configuration
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

  constructor() {
    // Track language changes for triggering change detection
    // Menu content will be rebuilt when menu opens (see onMenuOpening)
    effect(() => {
      this.languageService.currentLanguage();
      if (this.menusInitialized) {
        this.cdr.markForCheck();
      }
    });
  }

  // Tooltip translations
  get menuTooltip(): string {
    return this.languageService.instant('MENU');
  }

  get preferencesTooltip(): string {
    return this.languageService.instant('PREFERENCES');
  }

  get myAccountTooltip(): string {
    return this.languageService.instant('MY_ACCOUNT');
  }

  optionsMenuList: MenuItem[] = [];
  profileMenuList: MenuItem[] = [];

  private buildMenus(): void {
    const config = this.toolbarMenusConfig();

    // Build preferences menu with configuration
    const preferencesMenuItems: MenuItem[] = [];

    // Language item
    if (MenuConfigHelper.shouldShowPreferencesItem(config, 'language')) {
      preferencesMenuItems.push({
        label: this.languageService.instant('LANGUAGE'),
        value: 'language',
        icon: 'language',
        disabled: MenuConfigHelper.isPreferencesItemDisabled(config, 'language'),
        children: [
          {
            label: 'English',
            value: 'en',
            selected: this.languageService.getLanguage() === 'en',
          },
          {
            label: '日本語 (Japanese)',
            value: 'ja',
            selected: this.languageService.getLanguage() === 'ja',
          },
          {
            label: 'हिन्दी (Hindi)',
            value: 'hi',
            selected: this.languageService.getLanguage() === 'hi',
          },
        ],
      });
    }

    // Theme item
    if (MenuConfigHelper.shouldShowPreferencesItem(config, 'theme')) {
      preferencesMenuItems.push({
        label: this.languageService.instant('THEME'),
        value: 'theme',
        icon: 'contrast',
        disabled: MenuConfigHelper.isPreferencesItemDisabled(config, 'theme'),
        children: [
          {
            label: this.languageService.instant('LIGHT'),
            value: 'light',
            icon: 'light_mode',
          },
          {
            label: this.languageService.instant('DARK'),
            value: 'dark',
            icon: 'dark_mode',
          },
          {
            label: this.languageService.instant('SYSTEM'),
            value: 'system',
            icon: 'computer',
          },
        ],
      });
    }

    // Display mode
    preferencesMenuItems.push({
      label: this.languageService.instant('DISPLAY'),
      value: 'mode',
      icon: 'aspect_ratio',
      disabled: MenuConfigHelper.isPreferencesMenuDisabled(config),
      children: [
        { label: this.languageService.instant('COMPACT'), value: 'compact', icon: 'density_small' },
        { label: this.languageService.instant('DEFAULT'), value: 'default', icon: 'density_medium' },
        { label: this.languageService.instant('LARGE'), value: 'large', icon: 'density_large' },
      ],
    });

    this.optionsMenuList = preferencesMenuItems;

    // Build profile menu with configuration
    const profileMenuItems: MenuItem[] = [];

    // Profile item
    if (MenuConfigHelper.shouldShowProfileItem(config, 'profile')) {
      profileMenuItems.push({
        label: this.languageService.instant('PROFILE'),
        value: 'profile',
        icon: 'person',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'profile'),
        showSelection: false,
      });
    }

    // Settings item
    if (MenuConfigHelper.shouldShowProfileItem(config, 'settings')) {
      profileMenuItems.push({
        label: this.languageService.instant('SETTINGS'),
        value: 'settings',
        icon: 'settings',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'settings'),
        showSelection: false,
      });
    }

    // Logout item
    if (MenuConfigHelper.shouldShowProfileItem(config, 'logout')) {
      profileMenuItems.push({
        label: this.languageService.instant('LOGOUT'),
        value: 'logout',
        icon: 'logout',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'logout'),
        showSelection: false,
      });
    }

    this.profileMenuList = profileMenuItems;
  }

  ngOnInit() {
    // Wait for translations before building menus
    this.languageService.get('LANGUAGE').subscribe(() => {
      this.buildMenus();
      this.menusInitialized = true;
      // Trigger change detection after initial menu build
      this.cdr.markForCheck();

      const savedMode = localStorage.getItem('ui-scale-mode') as
        | 'compact'
        | 'default'
        | 'large';
      if (
        savedMode === 'compact' ||
        savedMode === 'large' ||
        savedMode === 'default'
      ) {
        document.body.classList.add(`scale-${savedMode}`);
      }
      // Update selected state for Display options
      this.setMenuSelection(this.optionsMenuList, 'mode', savedMode || 'default');

      const savedTheme = localStorage.getItem('app-theme-mode') as
        | 'light'
        | 'dark'
        | 'system';
      // Update selected state for Theme options
      this.setMenuSelection(this.optionsMenuList, 'theme', savedTheme || 'light');
    });
  }
  onMenuSelect(item: MenuItem) {
    // UI Scale
    if (
      item.value === 'compact' ||
      item.value === 'default' ||
      item.value === 'large'
    ) {
      this.setUiScale(item.value);
    }
    // Theme
    if (
      item.value === 'light' ||
      item.value === 'dark' ||
      item.value === 'system'
    ) {
      this.themeService.setTheme(item.value);
    }
    // Language switching - must be after other actions
    if (item.value === 'en' || item.value === 'ja' || item.value === 'hi') {
      const currentLanguage = this.languageService.getLanguage();
      // Only change language if it's different from current
      if (currentLanguage !== item.value) {
        this.languageService.setLanguage(item.value);
        // Show success snackbar after language change
        // Use setTimeout to ensure translations are loaded
        setTimeout(() => {
          this.snackbarService.success(
            this.languageService.instant('LANGUAGE_CHANGED_SUCCESSFULLY'),
            3000
          );
        }, 100);
      }
    }
    // Logout
    if (item.value === 'logout') {
      this.logout();
    }
  }
  setMenuSelection(menuList: MenuItem[], parent: string, value: string) {
    const parentMenu = menuList.find((menu) => menu.value === parent);
    if (parentMenu && parentMenu.children) {
      parentMenu.children.forEach((child) => {
        child.selected = child.value === value;
      });
    }
  }

  toggleMenu(): void {
    this.sideMenuToggle.emit();
  }

  onMenuOpening(): void {
    // Rebuild menus when the menu is opened to ensure translations are up-to-date
    // This fixes the issue where language changes don't update menu on first switch
    if (this.menusInitialized) {
      this.buildMenus();
    }
  }

  setUiScale(mode: 'compact' | 'default' | 'large') {
    const body = document.body;

    // Remove existing scale classes
    body.classList.remove('scale-compact', 'scale-large', 'scale-default');

    // Only apply a class if it's not default
    if (mode === 'compact') {
      body.classList.add('scale-compact');
    } else if (mode === 'large') {
      body.classList.add('scale-large');
    } else if (mode === 'default') {
      body.classList.add('scale-default');
    }

    localStorage.setItem('ui-scale-mode', mode);
    console.log('Setting UI scale to:', mode);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
