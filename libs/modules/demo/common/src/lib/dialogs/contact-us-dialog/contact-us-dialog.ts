import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'demo-contact-us-dialog',
  imports: [GenericDialogComponent, ButtonComponent, TranslateModule],
  templateUrl: './contact-us-dialog.html',
  styleUrl: './contact-us-dialog.scss',
})
export class ContactUsDialog {
  private readonly dialogRef = inject(MatDialogRef<ContactUsDialog>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
