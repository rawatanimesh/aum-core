import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';

export type DisplayMode = 'compact' | 'default' | 'large';

const STORAGE_KEY = 'ui-scale-mode';
const SCALES: DisplayMode[] = ['compact', 'default', 'large'];

@Injectable({ providedIn: 'root' })
export class UiScaleService {
  private readonly appConfigService = inject(AppConfigService);

  constructor() {
    this.loadScale();
  }

  setScale(mode: DisplayMode): void {
    localStorage.setItem(STORAGE_KEY, mode);
    this.applyScale(mode);
  }

  getScale(): DisplayMode {
    return (localStorage.getItem(STORAGE_KEY) as DisplayMode)
      ?? this.appConfigService.defaults()?.displayMode
      ?? 'default';
  }

  private loadScale(): void {
    this.applyScale(this.getScale());
  }

  private applyScale(mode: DisplayMode): void {
    SCALES.forEach((s) => document.body.classList.remove(`scale-${s}`));
    document.body.classList.add(`scale-${mode}`);
  }
}
