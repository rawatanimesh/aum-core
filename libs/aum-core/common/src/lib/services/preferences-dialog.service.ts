import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  PreferencesDialogComponent,
  PreferencesDialogData,
} from '../components/preferences-dialog/preferences-dialog.component';

@Injectable({ providedIn: 'root' })
export class PreferencesDialogService {
  private dialog = inject(MatDialog);

  open(initialTab?: PreferencesDialogData['initialTab']): void {
    this.dialog.open(PreferencesDialogComponent, {
      data: { initialTab } satisfies PreferencesDialogData,
      panelClass: 'aum-prefs-dialog-panel',
      autoFocus: false,
      restoreFocus: false,
      width: '450px',
      maxWidth: '95vw',
    });
  }
}
