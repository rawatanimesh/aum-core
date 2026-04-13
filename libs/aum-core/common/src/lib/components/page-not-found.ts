import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@aum/ui/buttons';
import { ConfirmationImageComponent } from './confirmation-image/confirmation-image.component';

@Component({
  selector: 'aum-page-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, TranslateModule, ConfirmationImageComponent],
  template: `
    <div class="page-not-found-container">
      <aum-confirmation-image type="page-not-found" class="not-found-image"></aum-confirmation-image>
      <h1 class="not-found-text">{{ 'AUM.PAGE_NOT_FOUND' | translate }}</h1>
      <aum-button
        [type]="'filled'"
        [value]="'AUM.GO_TO_HOME' | translate"
        (clickButton)="navigateToHome()"
      ></aum-button>
    </div>
  `,
  styles: [
    `
      @use 'functions' as *;

      .page-not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: rem(24);
      }

      .not-found-image {
        max-width: rem(200);
        width: 100%;
        height: auto;
      }

      .not-found-text {
        font-size: rem(20);
        font-weight: 600;
        margin: 0;
      }
    `,
  ],
})
export class PageNotFoundComponent {
  private router = inject(Router);

  navigateToHome() {
    this.router.navigateByUrl('/');
  }
}