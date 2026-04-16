import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfirmationDialogService } from '@aum/ui/dialogs';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-confirmation-dialog-examples',
  standalone: true,
  imports: [ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-dialog-examples.html',
})
export class ConfirmationDialogExamples {
  private confirmDialog = inject(ConfirmationDialogService);
  lastResult = signal<string>('—');

  openBasic() {
    this.confirmDialog.open({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
    });
  }

  openWithImage() {
    this.confirmDialog.open({
      confirmationImage: 'alert',
      title: 'Delete Item',
      message: 'This will permanently delete the item. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep',
    });
  }

  openCustomText() {
    this.confirmDialog.open({
      confirmationImage: 'check',
      title: 'Publish Article',
      message: 'Your article will be visible to all users.',
      confirmText: 'Publish',
      cancelText: 'Not yet',
    });
  }

  openAndTrackResult() {
    this.confirmDialog.open({
      confirmationImage: 'info',
      title: 'Leave Page',
      message: 'You have unsaved changes. Leave anyway?',
      confirmText: 'Leave',
      cancelText: 'Stay',
    }).afterClosed().subscribe(result => {
      this.lastResult.set(result === true ? 'Confirmed' : result === false ? 'Cancelled' : 'Dismissed');
    });
  }
}
