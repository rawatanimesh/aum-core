import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarContentService } from '@aum/templates/aum-template';
import { HelpDialog, ContactUsDialog } from '@demo/playground';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.toolbarContentService.registerGlobalAction(
      { id: 'help', icon: 'help', tooltip: 'HELP', type: 'icon', order: 10, overflow: true },
      () => this.openHelpDialog()
    );

    this.toolbarContentService.registerGlobalAction(
      { id: 'contact', icon: 'email', tooltip: 'CONTACT_US', type: 'icon', order: 11, overflow: true },
      () => this.openContactUsDialog()
    );
  }

  private openHelpDialog(): void {
    this.dialog.open(HelpDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  private openContactUsDialog(): void {
    this.dialog.open(ContactUsDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.toolbarContentService.unregisterGlobalAction('help');
    this.toolbarContentService.unregisterGlobalAction('contact');
  }
}
