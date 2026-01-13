import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  ErrorHandler,
  importProvidersFrom,
  provideAppInitializer,
  inject
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { APP_CONFIG, GlobalErrorHandler, httpErrorInterceptor, RippleConfigService  } from '@aum/utils/services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { appRoutes } from './app.routes';
import appConfiguration from './app-config.json';

// Factory function for translation loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // Translation module (must be before HttpClient)
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
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
    // Material ripple global options
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: {
        disabled: appConfiguration.disableRipple ?? false,
      } as RippleGlobalOptions,
    },
    // Initialize ripple config service to sync with app config changes
    provideAppInitializer(() => {
      // Inject the service to instantiate it and trigger the effect that watches for config changes
      inject(RippleConfigService);
    }),
  ],
};
