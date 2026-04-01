import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'demo-about-dialog',
  imports: [GenericDialogComponent, ButtonComponent, TranslateModule],
  templateUrl: './about-dialog.html',
  styleUrl: './about-dialog.scss',
})
export class AboutDialog {
  private readonly dialogRef = inject(MatDialogRef<AboutDialog>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
