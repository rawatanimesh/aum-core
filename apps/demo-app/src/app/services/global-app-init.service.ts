import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  private dialog = inject(MatDialog);

  constructor() {
    this.initializeGlobalActions();
  }

  private initializeGlobalActions(): void {
    // Feedback — visible in main toolbar
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

    // Help — overflow: shown in more_vert menu on desktop, settings drawer on mobile
    this.toolbarContentService.registerGlobalAction(
      { id: 'help', icon: 'help', tooltip: 'HELP', type: 'icon', order: 10, overflow: true },
      () => this.openHelpDialog()
    );

    // Contact Us — overflow
    this.toolbarContentService.registerGlobalAction(
      { id: 'contact', icon: 'email', tooltip: 'CONTACT_US', type: 'icon', order: 11, overflow: true },
      () => this.openContactUsDialog()
    );
  }

  private openFeedback(): void {
    this.snackbarService.info(
      this.languageService.instant('FEEDBACK_DIALOG_OPENED'),
      3000
    );
    // TODO: Implement your feedback dialog here
  }

  private async openHelpDialog(): Promise<void> {
    const { HelpDialog } = await import('@demo/playground');
    this.dialog.open(HelpDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  private async openContactUsDialog(): Promise<void> {
    const { ContactUsDialog } = await import('@demo/playground');
    this.dialog.open(ContactUsDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
