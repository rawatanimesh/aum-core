import { inject, Injectable, InjectionToken, signal, computed } from '@angular/core';

/**
 * Navigation item interface for sidenav
 */
export interface SideNavItem {
  label: string;
  value: string;
  icon?: string;
  selected?: boolean;
  expanded?: boolean;
  children?: SideNavItem[];
}

/**
 * Configuration for individual menu items
 */
export interface MenuItemConfig {
  /** Whether to show this menu item (default: true) */
  show?: boolean;
  /** Whether to disable this menu item (default: false) */
  disabled?: boolean;
}

/**
 * Configuration for preferences menu
 */
export interface PreferencesMenuConfig {
  /** Whether to show the entire preferences menu (default: true) */
  show?: boolean;
  /** Whether to disable the entire preferences menu (default: false) */
  disabled?: boolean;
  /** Individual items configuration */
  items?: {
    theme?: MenuItemConfig;
    language?: MenuItemConfig;
  };
}

/**
 * Configuration for profile menu
 */
export interface ProfileMenuConfig {
  /** Whether to show the entire profile menu (default: true) */
  show?: boolean;
  /** Whether to disable the entire preferences menu (default: false) */
  disabled?: boolean;
  /** Individual items configuration */
  items?: {
    profile?: MenuItemConfig;
    settings?: MenuItemConfig;
    logout?: MenuItemConfig;
  };
}

/**
 * Configuration for toolbar menus
 */
export interface ToolbarMenuConfig {
  /** Preferences menu configuration */
  preferences?: PreferencesMenuConfig;
  /** Profile menu configuration */
  profile?: ProfileMenuConfig;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  /** Path to the brand logo (used in sidenav/sidebar) */
  brandLogo: string;

  /** Path to the application logo (used in toolbar) */
  appLogo: string;

  /** Application name (used as fallback when logo is not available) */
  appName?: string;

  /** Navigation items for the sidenav */
  navItems: SideNavItem[];

  /** Toolbar menu configuration (optional) */
  toolbarMenus?: ToolbarMenuConfig;

  /** Whether to disable ripple effect globally for all Material components (default: false) */
  disableRipple?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  brandLogo: 'assets/brand-logo.svg',
  appLogo: 'assets/app-logo.svg',
  navItems: [],
};

/**
 * Injection token for app configuration
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_CONFIG,
});

/**
 * Service to access application configuration
 * Provides reactive access to app config with signal-based updates
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  /** Signal holding the current configuration */
  private readonly _config = signal<AppConfig>(inject(APP_CONFIG));

  /** Public readonly access to config signal */
  readonly config = this._config.asReadonly();

  /** Computed signal for toolbar menu configuration */
  readonly toolbarMenus = computed(() => this._config().toolbarMenus);

  /** Computed signal for brand logo */
  readonly brandLogo = computed(() => this._config().brandLogo);

  /** Computed signal for app logo */
  readonly appLogo = computed(() => this._config().appLogo);

  /** Computed signal for app name */
  readonly appName = computed(() => this._config().appName);

  /** Computed signal for navigation items */
  readonly navItems = computed(() => this._config().navItems);

  /** Computed signal for ripple disabled state */
  readonly disableRipple = computed(() => this._config().disableRipple ?? false);

  /**
   * Updates the entire configuration
   */
  setConfig(config: AppConfig): void {
    this._config.set(config);
  }

  /**
   * Updates specific parts of the configuration
   */
  updateConfig(partialConfig: Partial<AppConfig>): void {
    this._config.update(current => ({
      ...current,
      ...partialConfig,
    }));
  }

  /**
   * Updates only the toolbar menu configuration
   */
  updateToolbarMenus(toolbarMenus: ToolbarMenuConfig): void {
    this._config.update(current => ({
      ...current,
      toolbarMenus,
    }));
  }
}
