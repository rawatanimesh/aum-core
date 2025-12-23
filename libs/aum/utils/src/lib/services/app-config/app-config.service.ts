import { inject, Injectable, InjectionToken } from '@angular/core';
import { SideMenuItem  } from '@aum/ui/navigation';

/**
 * Application configuration interface
 */
export interface AppConfig {
  /** Path to the brand logo (used in sidenav/sidebar) */
  brandLogo: string;

  /** Path to the application logo (used in toolbar) */
  appLogo: string;

  /** Text of the application name (used in toolbar) */
  appName: string;

  /** Navigation items for the sidenav */
  navItems: SideMenuItem[];
}

/**
 * Default configuration values
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  brandLogo: 'assets/brand-logo.svg',
  appLogo: 'assets/app-logo.svg',
  appName: 'AUM Core',
  navItems: [],
};

/**
 * Injection token for app configuration
 *
 * @example
 * // In app's main.ts or app.config.ts
 * import { APP_CONFIG } from '@aum/utils/services';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     {
 *       provide: APP_CONFIG,
 *       useValue: {
 *         brandLogo: 'assets/my-brand-logo.svg',
 *         appLogo: 'assets/my-app-logo.svg'
 *       }
 *     }
 *   ]
 * };
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_CONFIG,
});

/**
 * Service to access application configuration
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly config: AppConfig;

  constructor() {
    this.config = inject(APP_CONFIG);
  }
}
