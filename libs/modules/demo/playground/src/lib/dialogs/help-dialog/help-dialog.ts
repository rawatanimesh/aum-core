import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'demo-help-dialog',
  imports: [GenericDialogComponent, ButtonComponent, TranslateModule],
  templateUrl: './help-dialog.html',
  styleUrl: './help-dialog.scss',
})
export class HelpDialog {
  private readonly dialogRef = inject(MatDialogRef<HelpDialog>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
