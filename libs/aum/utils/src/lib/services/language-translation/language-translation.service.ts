import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

type LanguageCode = 'en' | 'ja' | 'hi';

@Injectable({ providedIn: 'root' })
export class LanguageTranslationService {
  private translateService = inject(TranslateService);
  private _currentLanguage = signal<LanguageCode>('en');
  readonly currentLanguage = this._currentLanguage.asReadonly();
  private readonly storageKey = 'app-language';

  constructor() {
    this.loadLanguage();
  }

  setLanguage(language: LanguageCode): void {
    localStorage.setItem(this.storageKey, language);
    this.translateService.use(language);
    this._currentLanguage.set(language);
  }

  getLanguage(): LanguageCode {
    return (localStorage.getItem(this.storageKey) as LanguageCode) || 'en';
  }

  instant(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  get(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  stream(key: string, params?: any): Observable<string> {
    return this.translateService.stream(key, params);
  }

  private loadLanguage(): void {
    const savedLanguage = this.getLanguage();
    this.translateService.setDefaultLang('en');
    this.translateService.use(savedLanguage);
    this._currentLanguage.set(savedLanguage);
  }
}
