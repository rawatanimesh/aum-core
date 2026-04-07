import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { GenericDialogComponent } from '@aum/ui/dialogs';

@Component({
  selector: 'demo-feature-detail-dialog',
  imports: [GenericDialogComponent, TranslateModule],
  template: `
    <aum-generic-dialog>
      <div dialog-header>{{ data.title | translate }}</div>
      <div dialog-body class="feature-detail-body">{{ data.description | translate }}</div>
    </aum-generic-dialog>
  `,
  styles: [`
    .feature-detail-body {
      white-space: pre-line;
    }
  `],
})
export class FeatureDetailDialog {
  readonly dialogRef = inject(MatDialogRef<FeatureDetailDialog>);
  readonly data = inject<{ title: string; description: string }>(MAT_DIALOG_DATA);
}
