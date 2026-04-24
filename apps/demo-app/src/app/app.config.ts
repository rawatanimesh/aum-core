import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  ErrorHandler,
  importProvidersFrom,
  provideAppInitializer,
  inject
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { APP_CONFIG, GlobalErrorHandler, httpErrorInterceptor, RippleConfigService, PaletteService, ThemeService } from '@aum/utils/services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from '@aum/utils/services';
import { appRoutes } from './app.routes';
import appConfiguration from './app-config.json';
import { GlobalAppInitService } from './services/global-app-init.service';

// Merges core library translations (AUM.*) with app-level translations at runtime.
// Core keys live under the AUM namespace; app keys are at root level — no collision possible.
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/aum.', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding(), withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
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
    // Initialize global app service for toolbar actions and other app-wide features
    provideAppInitializer(() => {
      // Inject the service to instantiate it and register global toolbar actions
      inject(GlobalAppInitService);
    }),
    // Eagerly apply palette and theme before any route/component renders
    provideAppInitializer(() => {
      inject(PaletteService);
      inject(ThemeService);
    }),
  ],
};
