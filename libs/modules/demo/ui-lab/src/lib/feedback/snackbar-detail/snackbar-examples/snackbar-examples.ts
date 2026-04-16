import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SnackbarService } from '@aum/ui/utilities';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-snackbar-examples',
  standalone: true,
  imports: [ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snackbar-examples.html',
})
export class SnackbarExamples {
  private snackbar = inject(SnackbarService);
  actionClicked = signal(false);

  showSuccess() { this.snackbar.success('Operation completed successfully.'); }
  showError()   { this.snackbar.error('Something went wrong. Please try again.'); }
  showWarning() { this.snackbar.warning('This action cannot be undone.'); }
  showInfo()    { this.snackbar.info('Your session will expire in 5 minutes.'); }

  showWithAction() {
    this.actionClicked.set(false);
    this.snackbar.success('File saved.', 5000, {
      label: 'Undo',
      callback: () => this.actionClicked.set(true),
    });
  }

  showShort() { this.snackbar.info('Quick notification.', 2000); }
  showLong()  { this.snackbar.warning('This message stays for 10 seconds.', 10000); }
}
