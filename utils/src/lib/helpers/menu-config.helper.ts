import {
  MenuItemConfig,
  PreferencesMenuConfig,
  ProfileMenuConfig,
  ToolbarMenuConfig,
} from '../services/app-config/app-config.service';

/**
 * Helper utility for interpreting menu configuration
 * Provides methods to check if menu items should be shown or disabled
 */
export class MenuConfigHelper {
  /**
   * Checks if a menu item should be shown
   */
  static shouldShow(config?: MenuItemConfig): boolean {
    return config?.show !== false;
  }

  /**
   * Checks if a menu item should be disabled
   */
  static isDisabled(config?: MenuItemConfig): boolean {
    return config?.disabled === true;
  }

  /**
   * Checks if the preferences menu should be shown
   */
  static shouldShowPreferencesMenu(toolbarConfig?: ToolbarMenuConfig): boolean {
    return this.shouldShow(toolbarConfig?.preferences);
  }

  /**
   * Checks if the preferences menu should be disabled
   */
  static isPreferencesMenuDisabled(toolbarConfig?: ToolbarMenuConfig): boolean {
    return this.isDisabled(toolbarConfig?.preferences);
  }

  /**
   * Checks if a specific preferences menu item should be shown
   */
  static shouldShowPreferencesItem(
    toolbarConfig?: ToolbarMenuConfig,
    item?: 'theme' | 'language'
  ): boolean {
    const prefsConfig = toolbarConfig?.preferences;

    if (!this.shouldShow(prefsConfig)) {
      return false;
    }

    if (item && prefsConfig?.items?.[item]) {
      return this.shouldShow(prefsConfig.items[item]);
    }

    return true;
  }

  /**
   * Checks if a specific preferences menu item should be disabled
   */
  static isPreferencesItemDisabled(
    toolbarConfig?: ToolbarMenuConfig,
    item?: 'theme' | 'language'
  ): boolean {
    const prefsConfig = toolbarConfig?.preferences;

    if (this.isDisabled(prefsConfig)) {
      return true;
    }

    if (item && prefsConfig?.items?.[item]) {
      return this.isDisabled(prefsConfig.items[item]);
    }

    return false;
  }

  /**
   * Checks if the profile menu should be shown
   */
  static shouldShowProfileMenu(toolbarConfig?: ToolbarMenuConfig): boolean {
    return this.shouldShow(toolbarConfig?.profile);
  }

  /**
   * Checks if the profile menu should be disabled
   */
  static isProfileMenuDisabled(toolbarConfig?: ToolbarMenuConfig): boolean {
    return this.isDisabled(toolbarConfig?.profile);
  }

  /**
   * Checks if a specific profile menu item should be shown
   */
  static shouldShowProfileItem(
    toolbarConfig?: ToolbarMenuConfig,
    item?: 'profile' | 'settings' | 'logout'
  ): boolean {
    const profileConfig = toolbarConfig?.profile;

    if (!this.shouldShow(profileConfig)) {
      return false;
    }

    if (item && profileConfig?.items?.[item]) {
      return this.shouldShow(profileConfig.items[item]);
    }

    return true;
  }

  /**
   * Checks if a specific profile menu item should be disabled
   */
  static isProfileItemDisabled(
    toolbarConfig?: ToolbarMenuConfig,
    item?: 'profile' | 'settings' | 'logout'
  ): boolean {
    const profileConfig = toolbarConfig?.profile;

    if (this.isDisabled(profileConfig)) {
      return true;
    }

    if (item && profileConfig?.items?.[item]) {
      return this.isDisabled(profileConfig.items[item]);
    }

    return false;
  }
}
