import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarContentService } from '@aum/templates/aum-template';

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
  private dialog = inject(MatDialog);

  constructor() {
    this.initializeGlobalActions();
  }

  private initializeGlobalActions(): void {
    // GitHub — shown as icon directly in toolbar
    this.toolbarContentService.registerGlobalAction(
      { id: 'github', icon: 'code', tooltip: 'VIEW_ON_GITHUB', type: 'icon', order: 9, overflow: false },
      () => window.open('https://github.com/rawatanimesh/aum-core', '_blank')
    );

    // About — overflow: shown in more_vert menu on desktop, settings drawer on mobile
    this.toolbarContentService.registerGlobalAction(
      { id: 'about', icon: 'info', tooltip: 'ABOUT', type: 'icon', order: 10, overflow: true },
      () => this.openAboutDialog()
    );

    // Submit Feedback — overflow
    this.toolbarContentService.registerGlobalAction(
      { id: 'feedback', icon: 'feedback', tooltip: 'SUBMIT_FEEDBACK', type: 'icon', order: 11, overflow: true },
      () => window.open('https://github.com/rawatanimesh/aum-core/issues', '_blank')
    );
  }

  private async openAboutDialog(): Promise<void> {
    const { AboutDialog } = await import('@demo/playground');
    this.dialog.open(AboutDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
