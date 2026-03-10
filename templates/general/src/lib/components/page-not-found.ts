import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'aum-page-not-found',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="page-not-found-container">
      <img
        src="assets/svgs/confirmation/page-not-found.svg"
        alt="Page Not Found"
        class="not-found-image"
      />
      <h1 class="not-found-text">Page Not Found</h1>
      <aum-button
        [type]="'filled'"
        [value]="'Go to Home'"
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