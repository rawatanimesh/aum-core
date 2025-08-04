import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'playground-generic-dialog-demo',
  imports: [CommonModule, GenericDialogComponent, ButtonComponent],
  templateUrl: './generic-dialog-demo.html',
  styleUrl: './generic-dialog-demo.scss',
})
export class GenericDialogDemo implements AfterViewInit {
  private readonly dialogRef = inject(MatDialogRef<GenericDialogDemo>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly items = Array.from({ length: 50 });

  ngAfterViewInit(): void {
    console.log('data received:', this.data);
  }

  closeDialog(result: any) {
    this.dialogRef.close(result);
  }
}
