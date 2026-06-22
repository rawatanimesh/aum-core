import { Component, inject, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../../../buttons/button/button.component';
import { AumChipComponent } from '../../../utilities/chip/chip';
import { GenericDialogComponent } from '../../../dialogs/generic-dialog/generic-dialog';
import { AumActiveFilter } from '../grid.types';

export interface AumFilterChipsDialogData {
  chips: AumActiveFilter[];
  appliedCount: number;
  onRemove: (key: string) => void;
}

export interface AumFilterChipsDialogResult {
  action: 'remove' | 'clearAll';
  key?: string;
}

@Component({
  selector: 'aum-filter-chips-dialog',
  standalone: true,
  imports: [TranslateModule, ButtonComponent, AumChipComponent, GenericDialogComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <aum-generic-dialog>
      <span dialog-header>{{ 'AUM.GRID_ACTIVE_FILTERS' | translate }}</span>

      <div dialog-body>
        <div class="aum-fcd-meta">
          <span class="aum-fcd-count">{{ 'AUM.GRID_FILTER_APPLIED_COUNT' | translate: { count: chips().length } }}</span>
          <aum-button
            type="basic"
            size="small"
            [value]="'AUM.GRID_FILTER_CLEAR_ALL' | translate"
            (clickButton)="clearAll()"
          ></aum-button>
        </div>

        <div class="aum-fcd-chips">
          @for (chip of chips(); track chip.key) {
            <aum-chip
              [label]="chip.label"
              [removable]="true"
              (removed)="removeChip(chip.key)"
            ></aum-chip>
          }
        </div>
      </div>
    </aum-generic-dialog>
  `,
  styles: [`
    @use 'functions' as *;

    .aum-fcd-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: rem(12);
    }

    .aum-fcd-count {
      font-size: rem(13);
      color: var(--mat-sys-on-surface-variant);
    }

    .aum-fcd-chips {
      display: flex;
      flex-wrap: wrap;
      gap: rem(8);
    }
  `],
})
export class AumFilterChipsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AumFilterChipsDialogComponent, AumFilterChipsDialogResult>);
  readonly data: AumFilterChipsDialogData = inject(MAT_DIALOG_DATA);

  readonly chips = signal([...this.data.chips]);

  removeChip(key: string): void {
    this.chips.update(list => list.filter(c => c.key !== key));
    this.data.onRemove(key);
    if (this.chips().length === 0) this.dialogRef.close();
  }

  clearAll(): void {
    this.dialogRef.close({ action: 'clearAll' });
  }
}
