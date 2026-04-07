import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';

export type ColorPalette = 'purple' | 'ocean-blue' | 'sea-green';

const STORAGE_KEY = 'app-color-palette';
const PALETTES: ColorPalette[] = ['purple', 'ocean-blue', 'sea-green'];

@Injectable({ providedIn: 'root' })
export class PaletteService {
  private readonly appConfigService = inject(AppConfigService);

  constructor() {
    this.loadPalette();
  }

  setPalette(palette: ColorPalette): void {
    localStorage.setItem(STORAGE_KEY, palette);
    this.applyPalette(palette);
  }

  getPalette(): ColorPalette {
    return (localStorage.getItem(STORAGE_KEY) as ColorPalette) || this.appConfigService.defaults()?.palette || 'sea-green';
  }

  private loadPalette(): void {
    this.applyPalette(this.getPalette());
  }

  private applyPalette(palette: ColorPalette): void {
    PALETTES.forEach((p) => document.body.classList.remove(`palette-${p}`));
    if (palette !== 'purple') {
      document.body.classList.add(`palette-${palette}`);
    }
  }
}
