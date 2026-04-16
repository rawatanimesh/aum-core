import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snackbar, SnackbarType, SnackbarAction } from './snackbar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private show(
    message: string,
    type: SnackbarType,
    duration = 5000,
    action?: SnackbarAction
  ) {
    this.snackBar.openFromComponent(Snackbar, {
      duration,
      data: { message, type, action },
      panelClass: ['custom-snackbar', `snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  success(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'success', duration, action);
  }

  warning(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'warning', duration, action);
  }

  info(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'info', duration, action);
  }

  error(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'error', duration, action);
  }
}
