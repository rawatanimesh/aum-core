import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'system';
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _themeIcon = signal('dark_mode'); // default light theme
  readonly themeIcon = this._themeIcon.asReadonly();
  private readonly storageKey = 'app-theme-mode';

  constructor() {
    this.loadTheme();
    this.listenToSystemThemeChange();
  }

  /**
   * Set theme explicitly
   */
  setTheme(mode: ThemeMode): void {
    localStorage.setItem(this.storageKey, mode);

    if (mode === 'system') {
      this.applySystemTheme();
      return;
    }

    this.applyTheme(mode);
  }

  /**
   * Get the current saved mode
   */
  getTheme(): ThemeMode {
    return (localStorage.getItem(this.storageKey) as ThemeMode) || 'light';
  }

  /**
   * Detect system changes (works when 'system' mode is active)
   */
  private listenToSystemThemeChange(): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.getTheme() === 'system') {
          this.applySystemTheme();
        }
      });
  }

  /**
   * Apply theme based on system preference
   */
  private applySystemTheme(): void {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Apply theme classes and update icon
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);

    this._themeIcon.set(theme === 'dark' ? 'light_mode' : 'dark_mode');
  }

  /**
   * Load and apply saved theme at startup
   */
  private loadTheme(): void {
    const savedTheme = this.getTheme();

    if (savedTheme === 'system') {
      this.applySystemTheme();
    } else {
      this.applyTheme(savedTheme);
    }
  }
}
