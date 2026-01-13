import { Injectable, inject, effect } from '@angular/core';
import { RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { AppConfigService } from '../app-config/app-config.service';

/**
 * Service to manage global ripple configuration
 * Automatically syncs ripple state with app configuration
 */
@Injectable({ providedIn: 'root' })
export class RippleConfigService {
  private appConfigService = inject(AppConfigService);
  private rippleGlobalOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });

  constructor() {
    // Watch for changes to the disableRipple config and update global options
    effect(() => {
      const disableRipple = this.appConfigService.disableRipple();
      if (this.rippleGlobalOptions) {
        this.rippleGlobalOptions.disabled = disableRipple;
      }
    });
  }

  /**
   * Get the current ripple disabled state
   */
  isRippleDisabled(): boolean {
    return this.appConfigService.disableRipple();
  }

  /**
   * Update the ripple disabled state
   * @param disabled - Whether to disable ripple globally
   */
  setRippleDisabled(disabled: boolean): void {
    this.appConfigService.updateConfig({ disableRipple: disabled });
  }
}
