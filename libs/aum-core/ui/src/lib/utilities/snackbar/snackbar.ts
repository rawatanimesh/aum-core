import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ButtonComponent } from '../../buttons/button/button.component';

import { SnackbarType } from './snackbar.service';

@Component({
  selector: 'aum-snackbar',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Snackbar {
  readonly snackBarRef = inject(MatSnackBarRef<Snackbar>);
  readonly data = inject(MAT_SNACK_BAR_DATA) as {
    message: string;
    type: SnackbarType;
    action?: { label: string; callback: () => void };
  };

  onAction() {
    this.data.action?.callback?.();
    this.snackBarRef.dismiss();
  }

  close() {
    this.snackBarRef.dismiss();
  }

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'assets/svgs/snackbar/success.svg';
      case 'error':
        return 'assets/svgs/snackbar/error.svg';
      case 'info':
        return 'assets/svgs/snackbar/info.svg';
      case 'warning':
        return 'assets/svgs/snackbar/warning.svg';
    }
  }
}
