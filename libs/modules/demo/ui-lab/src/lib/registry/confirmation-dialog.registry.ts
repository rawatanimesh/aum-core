export const CONFIRMATION_DIALOG_META = {
  name: 'Confirmation Dialog',
  selector: 'ConfirmationDialogService',
  importFrom: '@aum/ui/dialogs',
  description:
    'An injectable service for confirm/cancel prompts. Supports optional illustrations, custom titles, messages, and button labels. Returns a boolean via afterClosed().',
  status: 'stable' as const,
};

export const CONFIRMATION_DIALOG_INTERFACES = [
  {
    name: 'ConfirmationDialogData',
    definition: `interface ConfirmationDialogData {
  confirmationImage?: ConfirmationImageType; // optional illustration
  title?: string;
  message?: string;
  confirmText?: string;  // default: 'Confirm'
  cancelText?: string;   // default: 'Cancel'
}`,
  },
  {
    name: 'ConfirmationImageType',
    definition: `type ConfirmationImageType =
  | 'alert'
  | 'announcement'
  | 'authorization-required'
  | 'check'
  | 'coming-soon'
  | 'data-not-available'
  | 'error-page'
  | 'info'
  | 'link-expired'
  | 'no-image'
  | 'page-not-found'
  | 'search-not-found'
  | 'under-maintenance'
  | 'work-in-progress';`,
  },
];

export const CONFIRMATION_DIALOG_EXAMPLES = {
  importPath: `import { ConfirmationDialogService } from '@aum/ui/dialogs';`,

  basicUsage: `@Component({ ... })
export class MyComponent {
  private confirmDialog = inject(ConfirmationDialogService);

  openBasic() {
    this.confirmDialog.open({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
    });
  }
}`,

  withImage: `this.confirmDialog.open({
  confirmationImage: 'alert',
  title: 'Delete Item',
  message: 'This will permanently delete the item. This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Keep',
});`,

  customText: `this.confirmDialog.open({
  confirmationImage: 'check',
  title: 'Publish Article',
  message: 'Your article will be visible to all users.',
  confirmText: 'Publish',
  cancelText: 'Not yet',
});`,

  handleResult: `this.confirmDialog.open({
  confirmationImage: 'info',
  title: 'Leave Page',
  message: 'You have unsaved changes. Leave anyway?',
  confirmText: 'Leave',
  cancelText: 'Stay',
}).afterClosed().subscribe(result => {
  if (result === true) {
    console.log('User confirmed — navigating away');
  } else if (result === false) {
    console.log('User cancelled — staying on page');
  } else {
    console.log('Dialog dismissed without a choice');
  }
});`,
};
