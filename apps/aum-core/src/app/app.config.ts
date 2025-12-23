import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '@aum/utils/services';
import { appRoutes } from './app.routes';
import appConfiguration from './app-config.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // App-specific configuration
    {
      provide: APP_CONFIG,
      useValue: appConfiguration
    }
  ],
};
