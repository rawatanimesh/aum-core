import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interface for toolbar action configuration
 * Generic interface that can be used for any toolbar action
 */
export interface ToolbarAction {
  id: string;
  icon: string;
  tooltip?: string;
  type?: 'outlined' | 'filled' | 'basic' | 'icon';
  value?: string;
  order?: number;
}

/**
 * Internal interface for storing action with its callback
 */
interface ToolbarActionItem {
  action: ToolbarAction;
  callback: () => void;
}

/**
 * Service for managing dynamic toolbar content
 * This is a generic service with no business logic - it only manages state
 * The application layer decides what actions to register and their behavior
 */
@Injectable({
  providedIn: 'root',
})
export class ToolbarContentService {
  private globalActionsMap = new Map<string, ToolbarActionItem>();
  private globalActions$ = new BehaviorSubject<ToolbarAction[]>([]);

  /**
   * Register a global toolbar action
   * @param action - The action configuration
   * @param callback - Function to execute when action is clicked
   */
  registerGlobalAction(action: ToolbarAction, callback: () => void): void {
    if (this.globalActionsMap.has(action.id)) {
      console.warn(
        `[ToolbarContentService] Action with id '${action.id}' already exists. Skipping registration.`
      );
      return;
    }

    this.globalActionsMap.set(action.id, { action, callback });
    this.emitGlobalActions();
  }

  /**
   * Unregister a global toolbar action
   * @param id - The unique identifier of the action to remove
   */
  unregisterGlobalAction(id: string): void {
    if (this.globalActionsMap.has(id)) {
      this.globalActionsMap.delete(id);
      this.emitGlobalActions();
    }
  }

  /**
   * Get observable of all global actions
   * Actions are sorted by order property
   */
  getGlobalActions(): Observable<ToolbarAction[]> {
    return this.globalActions$.asObservable();
  }

  /**
   * Execute the callback for a specific action
   * @param id - The unique identifier of the action
   */
  executeAction(id: string): void {
    const item = this.globalActionsMap.get(id);
    if (item) {
      item.callback();
    } else {
      console.warn(
        `[ToolbarContentService] No action found with id '${id}'`
      );
    }
  }

  /**
   * Clear all global actions
   */
  clearAllGlobalActions(): void {
    this.globalActionsMap.clear();
    this.emitGlobalActions();
  }

  /**
   * Emit current actions sorted by order
   */
  private emitGlobalActions(): void {
    const actions = Array.from(this.globalActionsMap.values())
      .map((item) => item.action)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    this.globalActions$.next(actions);
  }
}
