import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ConfirmationImageType =
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
  | 'work-in-progress';

@Component({
  selector: 'aum-confirmation-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-image.component.html',
  host: { 'aria-hidden': 'true' },
  styles: [
    `
      :host {
        display: block;
        color: var(--mat-sys-primary);
      }

      svg {
        max-width: 100%;
        height: auto;
        display: block;
      }
    `,
  ],
})
export class ConfirmationImageComponent {
  type = input.required<ConfirmationImageType>();
}
