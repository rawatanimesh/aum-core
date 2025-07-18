import { Component, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { ButtonComponent } from '@aum/ui/buttons';
import { PageComponent } from '@aum/ui/layout';
import { ConfirmationDialogService } from '@aum/ui/dialogs';
import {
  InputComponent,
  DatePickerComponent,
  CheckboxComponent,
  RadioButton,
} from '@aum/ui/form-controls';
import { SnackbarService } from '@aum/ui/utilities';

import { GenericDialogDemo } from '../generic-dialog-demo/generic-dialog-demo';

@Component({
  selector: 'aum-playground',
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ButtonComponent,
    PageComponent,
    InputComponent,
    DatePickerComponent,
    CheckboxComponent,
    RadioButton,
  ],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
})
export class Playground {
  readonly dialog = inject(ConfirmationDialogService);
  readonly dialogRef = inject(MatDialog);
  readonly snackbar = inject(SnackbarService);
  pageInfo = {
    breadcrumbs: [
      { title: 'Playground', route: '/playground' },
      { title: 'Child A', route: '/dashboard' },
      { title: 'Child A2', route: '/dashboard' },
      // { title: 'Child A3', route: '/dashboard' },
      // { title: 'Child A4', route: '/A/childA4' },
      // { title: 'Child A5', route: '/dashboard' },
    ],
  };
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  openMenu() {
    console.log('clicked');
  }
  openConfirmationDialog() {
    this.dialog
      .open({
        confirmationImage: 'assets/svgs/confirmation/info.svg',
        title: 'Note:',
        message:
          'By logging in, you authorize the Agent to access your personal and official details (including confidential data) for the purpose of summarizing & generating results .',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // User clicked confirm
          console.log('User confirmed the action');
        } else {
          // User clicked cancel
          console.log('User canceled the action');
        }
      });
  }

  openGenericDialog() {
    const dialogRef2 = this.dialogRef.open(GenericDialogDemo, {
      width: '800px',
      data: { name: 'Animesh' },
      panelClass: 'aum-dialog-container',
      disableClose: false, // Optional: allow clicking outside to close
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef2.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User confirmed the action');
        this.snackbar.success('Profile updated successfully', 700000);
      } else {
        console.log('User canceled the action');
        this.snackbar.error('Failed to save changes', 5000, {
          label: 'Retry',
          callback: () => {
            console.log('snackbar open error');
          },
        });
      }
    });
  }
  openSnackbar(state: string) {
    switch (state) {
      case 'success':
        this.snackbar.success('Profile updated successfully');
        break;
      case 'error':
        this.snackbar.error('Profile not updated', 5000, {
          label: 'Retry',
          callback: () => {
            console.log('Snackbar retry method');
          },
        });
        break;
      case 'warning':
        this.snackbar.warning('Duplicate entry saved');
        break;
      case 'info':
        this.snackbar.info('Profile change will reflect shortly');
        break;
    }
  }

  valueChange(ev: any) {
    console.log('valueChange', ev);
  }
  dateSelected(ev: any) {
    console.log(ev);
  }
  checkboxState(event: any, state: any) {
    console.log(event, state);
  }
  radioChange(event: any) {
    console.log(event);
  }
}
