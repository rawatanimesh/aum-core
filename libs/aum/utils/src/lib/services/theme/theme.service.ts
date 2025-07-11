import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _themeIcon = signal('dark_mode'); // default light theme
  readonly themeIcon = this._themeIcon.asReadonly();

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('app-theme', isDark ? 'dark' : 'light');
    this._themeIcon.set(isDark ? 'light_mode' : 'dark_mode');
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('app-theme');
    const isDark = savedTheme === 'dark';

    if (isDark) {
      document.body.classList.add('dark-mode');
      this._themeIcon.set('light_mode');
    } else {
      document.body.classList.remove('dark-mode');
      this._themeIcon.set('dark_mode');
    }
  }
}
