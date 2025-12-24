import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  ErrorHandler 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_CONFIG, GlobalErrorHandler, httpErrorInterceptor  } from '@aum/utils/services';
import { appRoutes } from './app.routes';
import appConfiguration from './app-config.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // Provide HttpClient with error interceptor
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    // Global error handler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    // App-specific configuration
    {
      provide: APP_CONFIG,
      useValue: appConfiguration,
    },
  ],
};
