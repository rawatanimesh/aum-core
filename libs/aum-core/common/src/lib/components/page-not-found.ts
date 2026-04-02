import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'aum-page-not-found',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  template: `
    <div class="page-not-found-container">
      <img
        src="assets/svgs/confirmation/page-not-found.svg"
        [attr.alt]="'AUM.PAGE_NOT_FOUND' | translate"
        class="not-found-image"
      />
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