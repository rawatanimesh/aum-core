import { ApiRow } from '../shared/api-table/api-table';

export const SNACKBAR_META = {
  name: 'Snackbar',
  selector: 'SnackbarService',
  importFrom: '@aum/ui/utilities',
  description:
    'An injectable service for displaying toast notifications. Four types: success, error, warning, info. Optional duration and action callback. Snackbars appear top-right with a default duration of 5000ms.',
  status: 'stable' as const,
};

export const SNACKBAR_SERVICE_METHODS: ApiRow[] = [
  {
    name: 'success(message, duration?, action?)',
    type: 'void',
    description: 'Displays a success (green) snackbar with the given message.',
  },
  {
    name: 'warning(message, duration?, action?)',
    type: 'void',
    description: 'Displays a warning (amber) snackbar with the given message.',
  },
  {
    name: 'info(message, duration?, action?)',
    type: 'void',
    description: 'Displays an info (blue) snackbar with the given message.',
  },
  {
    name: 'error(message, duration?, action?)',
    type: 'void',
    description: 'Displays an error (red) snackbar with the given message.',
  },
];

export const SNACKBAR_INTERFACES = [
  {
    name: 'SnackbarAction',
    definition: `interface SnackbarAction {
  label: string;         // Button label shown in the snackbar
  callback: () => void;  // Called when the user clicks the action button
}`,
  },
  {
    name: 'SnackbarType',
    definition: `type SnackbarType = 'success' | 'warning' | 'info' | 'error';`,
  },
];

export const SNACKBAR_EXAMPLES = {
  importPath: `import { SnackbarService } from '@aum/ui/utilities';
import type { SnackbarAction } from '@aum/ui/utilities';`,

  allTypes: `@Component({
  template: \`
    <aum-button type="filled" value="Success" (clickButton)="showSuccess()"></aum-button>
    <aum-button type="outlined" value="Error" (clickButton)="showError()"></aum-button>
    <aum-button type="outlined" value="Warning" (clickButton)="showWarning()"></aum-button>
    <aum-button type="basic" value="Info" (clickButton)="showInfo()"></aum-button>
  \`,
})
export class MyComponent {
  private snackbar = inject(SnackbarService);

  showSuccess() { this.snackbar.success('Operation completed successfully.'); }
  showError()   { this.snackbar.error('Something went wrong. Please try again.'); }
  showWarning() { this.snackbar.warning('This action cannot be undone.'); }
  showInfo()    { this.snackbar.info('Your session will expire in 5 minutes.'); }
}`,

  withAction: `export class MyComponent {
  private snackbar = inject(SnackbarService);

  showWithAction() {
    this.snackbar.success('File saved.', 5000, {
      label: 'Undo',
      callback: () => console.log('Undo clicked'),
    });
  }
}`,

  customDuration: `// Short notification — disappears after 2 seconds
this.snackbar.info('Quick notification.', 2000);

// Long notification — stays for 10 seconds
this.snackbar.warning('This message stays for 10 seconds.', 10000);`,
};
