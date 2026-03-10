import { Injectable, TemplateRef } from '@angular/core';
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
 * Interface for custom toolbar template configuration
 * Allows registration of custom HTML templates in the toolbar
 */
export interface ToolbarCustomTemplate {
  id: string;
  template: TemplateRef<unknown>;
  order?: number;
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

  private customTemplatesMap = new Map<string, ToolbarCustomTemplate>();
  private customTemplates$ = new BehaviorSubject<ToolbarCustomTemplate[]>([]);

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

  /**
   * Register a custom template for the toolbar
   * @param template - The template configuration with TemplateRef
   */
  registerCustomTemplate(template: ToolbarCustomTemplate): void {
    if (this.customTemplatesMap.has(template.id)) {
      console.warn(
        `[ToolbarContentService] Template with id '${template.id}' already exists. Skipping registration.`
      );
      return;
    }

    this.customTemplatesMap.set(template.id, template);
    this.emitCustomTemplates();
  }

  /**
   * Unregister a custom template
   * @param id - The unique identifier of the template to remove
   */
  unregisterCustomTemplate(id: string): void {
    if (this.customTemplatesMap.has(id)) {
      this.customTemplatesMap.delete(id);
      this.emitCustomTemplates();
    }
  }

  /**
   * Get observable of all custom templates
   * Templates are sorted by order property
   */
  getCustomTemplates(): Observable<ToolbarCustomTemplate[]> {
    return this.customTemplates$.asObservable();
  }

  /**
   * Clear all custom templates
   */
  clearAllCustomTemplates(): void {
    this.customTemplatesMap.clear();
    this.emitCustomTemplates();
  }

  /**
   * Emit current templates sorted by order
   */
  private emitCustomTemplates(): void {
    const templates = Array.from(this.customTemplatesMap.values()).sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    this.customTemplates$.next(templates);
  }
}
