import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogComponent } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

// --- Mini dialog content components ---

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent],
  template: `
    <aum-generic-dialog>
      <span dialog-header>Basic Dialog</span>
      <div dialog-body>
        <p>Use <strong>[dialog-header]</strong>, <strong>[dialog-body]</strong>, and <strong>[dialog-footer]</strong> slots to fill the dialog.</p>
        <p>This second paragraph shows how the body handles multiple elements with proper spacing.</p>
      </div>
    </aum-generic-dialog>
  `,
})
class BasicDialogContent {}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, ButtonComponent],
  template: `
    <aum-generic-dialog [showCloseButton]="false">
      <span dialog-header>No Close Button</span>
      <div dialog-body>
        <p>The header close button is hidden via <code>[showCloseButton]="false"</code>.</p>
        <p>Use the footer button or click the backdrop to dismiss.</p>
      </div>
      <div dialog-footer>
        <aum-button type="filled" value="Dismiss" (clickButton)="close()"></aum-button>
      </div>
    </aum-generic-dialog>
  `,
})
class NoCloseButtonDialogContent {
  private dialogRef = inject(MatDialogRef<NoCloseButtonDialogContent>);
  close() { this.dialogRef.close(); }
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent],
  template: `
    <aum-generic-dialog [noPadding]="true">
      <span dialog-header>No Padding</span>
      <div dialog-body class="dialog-demo-image-placeholder">Edge-to-edge content area</div>
    </aum-generic-dialog>
  `,
})
class NoPaddingDialogContent {}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent],
  template: `
    <aum-generic-dialog bodyHeight="260px">
      <span dialog-header>Fixed Body Height</span>
      <div dialog-body>
        @for (item of items; track item) {
          <p>Item {{ item }}: lorem ipsum dolor sit amet consectetur</p>
        }
      </div>
    </aum-generic-dialog>
  `,
})
class BodyHeightDialogContent {
  items = Array.from({ length: 20 }, (_, i) => i + 1);
}

// --- Main examples host ---

@Component({
  selector: 'demo-generic-dialog-examples',
  standalone: true,
  imports: [ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generic-dialog-examples.html',
})
export class GenericDialogExamples {
  private dialog = inject(MatDialog);

  openBasic()      { this.dialog.open(BasicDialogContent); }
  openNoClose()    { this.dialog.open(NoCloseButtonDialogContent); }
  openNoPadding()  { this.dialog.open(NoPaddingDialogContent, { maxWidth: '600px' }); }
  openBodyHeight() { this.dialog.open(BodyHeightDialogContent); }
}
