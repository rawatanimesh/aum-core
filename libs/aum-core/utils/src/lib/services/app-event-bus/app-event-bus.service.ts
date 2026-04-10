import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Application event types
 */
export enum AppEventType {
  LOGOUT = 'LOGOUT',
  THEME_CHANGED = 'THEME_CHANGED',
  UI_SCALE_CHANGED = 'UI_SCALE_CHANGED',
  LANGUAGE_CHANGED = 'LANGUAGE_CHANGED',
  TEMPLATE_CHANGED = 'TEMPLATE_CHANGED',
  PALETTE_CHANGED = 'PALETTE_CHANGED',
}

/**
 * Application event interface
 */
export interface AppEvent<T = any> {
  type: AppEventType;
  payload?: T;
}

/**
 * Payload interface for theme change events
 */
export interface ThemeChangedPayload {
  theme: 'light' | 'dark' | 'system';
  previousTheme?: 'light' | 'dark' | 'system';
}

/**
 * Payload interface for UI scale change events
 */
export interface UiScaleChangedPayload {
  scale: 'compact' | 'default' | 'large';
  previousScale?: 'compact' | 'default' | 'large';
}

/**
 * Payload interface for palette change events
 */
export interface PaletteChangedPayload {
  palette: 'purple' | 'ocean-blue' | 'sea-green';
  previousPalette?: 'purple' | 'ocean-blue' | 'sea-green';
}

/**
 * Payload interface for language change events
 */
export interface LanguageChangedPayload {
  language: string;
  previousLanguage?: string;
}

/**
 * Event Bus Service for application-wide events.
 * Provides a decoupled way for components to communicate across the application.
 */
@Injectable({
  providedIn: 'root',
})
export class AppEventBusService {
  private eventSubject = new Subject<AppEvent>();

  /**
   * Emit an event to the event bus
   */
  emit<T>(type: AppEventType, payload?: T): void {
    this.eventSubject.next({ type, payload });
  }

  /**
   * Listen to events of a specific type
   */
  on<T>(eventType: AppEventType): Observable<T | undefined> {
    return this.eventSubject.asObservable().pipe(
      filter((event) => event.type === eventType),
      map((event) => event.payload as T | undefined)
    );
  }

  /**
   * Listen to all events
   */
  onAll(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }
}
