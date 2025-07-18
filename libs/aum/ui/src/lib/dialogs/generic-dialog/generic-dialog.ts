import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'aum-generic-dialog',
  imports: [CommonModule, MatDialogModule, ButtonComponent],
  templateUrl: './generic-dialog.html',
  styleUrl: './generic-dialog.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'GenericDialogComponent',
})
export class GenericDialogComponent {
  @Input() showCloseButton = true;

  readonly dialogRef = inject(MatDialogRef<GenericDialogComponent>, {
    optional: true,
  });

  close() {
    this.dialogRef?.close();
  }
}
