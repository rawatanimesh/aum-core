import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './confirmation-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  readonly dialog = inject(MatDialog);

  open(
    data: ConfirmationDialogData
  ): MatDialogRef<ConfirmationDialogComponent, boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data,
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
