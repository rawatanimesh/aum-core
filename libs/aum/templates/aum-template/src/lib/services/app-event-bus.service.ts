import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Application event types
 */
export enum AppEventType {
  LOGOUT = 'LOGOUT',
  // Add more event types as needed
}

/**
 * Application event interface
 */
export interface AppEvent<T = any> {
  type: AppEventType;
  payload?: T;
}

/**
 * Event Bus Service for application-wide events
 * Provides a decoupled way for components to communicate across the application
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
