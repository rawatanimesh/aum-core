import { ApiRow } from '../shared/api-table/api-table';

export const GENERIC_DIALOG_META = {
  name: 'Generic Dialog',
  selector: '<aum-generic-dialog>',
  importFrom: '@aum/ui/dialogs',
  description:
    'A configurable dialog shell with a close button, scrollable body, and optional padding. Project your content inside it and open it with MatDialog.',
  status: 'stable' as const,
};

export const GENERIC_DIALOG_INPUTS: ApiRow[] = [
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: 'true',
    description: 'Shows or hides the close (×) button in the dialog header.',
  },
  {
    name: 'noPadding',
    type: 'boolean',
    default: 'false',
    description: 'Removes the default body padding, allowing content (e.g. images) to extend edge-to-edge.',
  },
  {
    name: 'bodyHeight',
    type: 'string',
    default: 'undefined',
    description: "Fixes the dialog body height and enables internal scrolling. Accepts any CSS length, e.g. '400px' or '50vh'.",
  },
];

export const GENERIC_DIALOG_INTERFACES = [
  {
    name: 'Usage pattern',
    definition: `// 1. Define a component that uses <aum-generic-dialog> as its template shell
@Component({
  standalone: true,
  imports: [GenericDialogComponent],
  encapsulation: ViewEncapsulation.None,
  template: \`
    <aum-generic-dialog>
      <p>Your projected content here.</p>
    </aum-generic-dialog>
  \`,
})
class MyDialogContent {}

// 2. Open it with MatDialog
@Component({ ... })
class MyPage {
  private dialog = inject(MatDialog);
  open() { this.dialog.open(MyDialogContent); }
}`,
  },
];

export const GENERIC_DIALOG_EXAMPLES = {
  importPath: `import { GenericDialogComponent } from '@aum/ui/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';`,

  basicUsage: `@Component({
  standalone: true,
  imports: [GenericDialogComponent],
  encapsulation: ViewEncapsulation.None,
  template: \`
    <aum-generic-dialog>
      <h2>Welcome to AUM</h2>
      <p>This is a basic generic dialog. Content is projected inside the dialog shell.</p>
    </aum-generic-dialog>
  \`,
})
class BasicDialogContent {}

@Component({ ... })
export class MyPage {
  private dialog = inject(MatDialog);
  openBasic() { this.dialog.open(BasicDialogContent); }
}`,

  noCloseButton: `@Component({
  standalone: true,
  imports: [GenericDialogComponent],
  encapsulation: ViewEncapsulation.None,
  template: \`
    <aum-generic-dialog [showCloseButton]="false">
      <p>This dialog must be dismissed programmatically.</p>
    </aum-generic-dialog>
  \`,
})
class NoCloseDialogContent {}`,

  noPaddingExample: `@Component({
  standalone: true,
  imports: [GenericDialogComponent],
  encapsulation: ViewEncapsulation.None,
  template: \`
    <aum-generic-dialog [noPadding]="true">
      <!-- Image or custom content extends edge-to-edge -->
      <img src="hero.jpg" alt="Hero" class="dialog-hero-image" />
      <div class="dialog-body">
        <p>Content below the image with your own spacing.</p>
      </div>
    </aum-generic-dialog>
  \`,
})
class NoPaddingDialogContent {}`,

  bodyHeightExample: `@Component({
  standalone: true,
  imports: [GenericDialogComponent],
  encapsulation: ViewEncapsulation.None,
  template: \`
    <aum-generic-dialog bodyHeight="300px">
      <!-- Body scrolls internally when content exceeds 300px -->
      @for (item of longList; track item) {
        <p>{{ item }}</p>
      }
    </aum-generic-dialog>
  \`,
})
class ScrollableDialogContent {
  longList = Array.from({ length: 30 }, (_, i) => \`Item \${i + 1}\`);
}`,
};
