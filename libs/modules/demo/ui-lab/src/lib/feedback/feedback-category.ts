import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

interface ComponentCard {
  nameKey: string;
  selector: string;
  descKey: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'demo-feedback-category',
  standalone: true,
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feedback-category.html',
  styleUrl: './feedback-category.scss',
})
export class FeedbackCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FEEDBACK', route: '/ui-lab/feedback' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_SNACKBAR',
      selector: 'SnackbarService',
      descKey: 'UI_LAB_COMP_SNACKBAR_DESC',
      route: '/ui-lab/feedback/snackbar',
      icon: 'notifications',
    },
    {
      nameKey: 'UI_LAB_GENERIC_DIALOG',
      selector: '<aum-generic-dialog>',
      descKey: 'UI_LAB_COMP_GENERIC_DIALOG_DESC',
      route: '/ui-lab/feedback/generic-dialog',
      icon: 'open_in_new',
    },
    {
      nameKey: 'UI_LAB_CONFIRMATION_DIALOG',
      selector: 'ConfirmationDialogService',
      descKey: 'UI_LAB_COMP_CONFIRMATION_DIALOG_DESC',
      route: '/ui-lab/feedback/confirmation-dialog',
      icon: 'check_circle',
    },
  ];
}
