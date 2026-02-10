import { Injectable, inject } from '@angular/core';
import { ToolbarContentService } from '@aum/templates/aum-template';
import { SnackbarService } from '@aum/ui/utilities';
import { LanguageTranslationService } from '@aum/utils/services';

/**
 * Global app initialization service
 * Handles app-level initialization tasks like registering global toolbar actions
 * Service auto-initializes when first injected (singleton)
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalAppInitService {
  private toolbarContentService = inject(ToolbarContentService);
  private snackbarService = inject(SnackbarService);
  private languageService = inject(LanguageTranslationService);

  constructor() {
    console.log('🔧 GlobalAppInitService: Initializing...');
    // Auto-initialize toolbar actions when service is created
    this.initializeGlobalActions();
  }

  /**
   * Initialize global toolbar actions
   * These actions will be available across all pages
   */
  private initializeGlobalActions(): void {
    console.log('📋 GlobalAppInitService: Registering global toolbar actions');

    // Register global feedback button
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'global-feedback',
        icon: 'feedback',
        tooltip: 'PROVIDE_FEEDBACK',
        type: 'icon',
        order: 1,
      },
      () => this.openFeedback()
    );
    console.log('✅ GlobalAppInitService: Feedback button registered');

    // Add more global actions here as needed
  }

  private openFeedback(): void {
    console.log('Feedback button clicked');
    this.snackbarService.info(
      this.languageService.instant('FEEDBACK_DIALOG_OPENED'),
      3000
    );
    // TODO: Implement your feedback dialog here
  }
}
