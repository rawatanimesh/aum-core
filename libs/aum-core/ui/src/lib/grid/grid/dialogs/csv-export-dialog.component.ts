import { Component, inject, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../../../buttons/button/button.component';
import { GenericDialogComponent } from '../../../dialogs/generic-dialog/generic-dialog';
import { InputComponent } from '../../../form-controls/input/input';

export interface AumCsvExportDialogData {
  defaultFilename: string;
  totalRows: number;
  filteredRows: number;
  filterActive: boolean;
}

export interface AumCsvExportDialogResult {
  filename: string;
}

@Component({
  selector: 'aum-csv-export-dialog',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, ButtonComponent, GenericDialogComponent, MatDialogModule, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <aum-generic-dialog>
      <span dialog-header>{{ 'AUM.GRID_CSV_EXPORT_TITLE' | translate }}</span>

      <div dialog-body class="aum-ced-body">
        <div class="aum-ced-row-info">
          <span class="aum-ced-row-count">{{ rowCountLabel() }}</span>
          @if (data.filterActive) {
            <span class="aum-ced-filter-badge">{{ 'AUM.GRID_CSV_FILTERED' | translate }}</span>
          }
        </div>

        <aum-input
          [label]="'AUM.GRID_CSV_FILENAME_LABEL' | translate"
          [control]="filenameControl"
          [placeholder]="'export.csv'"
          (keydown.enter)="download()"
        ></aum-input>
      </div>

      <div dialog-footer class="aum-ced-footer">
        <aum-button
          type="basic"
          [value]="'AUM.CANCEL' | translate"
          (clickButton)="cancel()"
        ></aum-button>
        <aum-button
          type="filled"
          icon="download"
          [value]="'AUM.GRID_CSV_DOWNLOAD' | translate"
          [disabled]="!filenameControl.value?.trim()"
          (clickButton)="download()"
        ></aum-button>
      </div>
    </aum-generic-dialog>
  `,
  styles: [`
    @use 'functions' as *;

    .aum-ced-body {
      display: flex;
      flex-direction: column;
      gap: rem(16);
      min-width: rem(340);
    }

    .aum-ced-row-info {
      display: flex;
      align-items: center;
      gap: rem(8);
      padding: rem(10) rem(12);
      border-radius: rem(6);
      background: var(--mat-sys-surface-container);
    }

    .aum-ced-row-count {
      font-size: rem(13);
      color: var(--mat-sys-on-surface);
      flex: 1;
    }

    .aum-ced-filter-badge {
      font-size: rem(11);
      font-weight: 500;
      color: var(--mat-sys-primary);
      background: var(--mat-sys-primary-container);
      padding: rem(2) rem(8);
      border-radius: rem(10);
      white-space: nowrap;
    }

    .aum-ced-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: rem(8);
    }
  `],
})
export class AumCsvExportDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AumCsvExportDialogComponent, AumCsvExportDialogResult>);
  readonly data: AumCsvExportDialogData = inject(MAT_DIALOG_DATA);

  readonly filenameControl = new FormControl(this.data.defaultFilename);

  readonly rowCountLabel = signal(this.buildRowCountLabel());

  private buildRowCountLabel(): string {
    const { totalRows, filteredRows, filterActive } = this.data;
    if (filterActive && filteredRows < totalRows) {
      return `${filteredRows} of ${totalRows} rows will be exported`;
    }
    return `${totalRows} rows will be exported`;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  download(): void {
    const raw = this.filenameControl.value?.trim() ?? '';
    if (!raw) return;
    const filename = raw.endsWith('.csv') ? raw : `${raw}.csv`;
    this.dialogRef.close({ filename });
  }
}
