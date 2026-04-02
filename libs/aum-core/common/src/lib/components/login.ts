import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthService } from '@aum/utils/services';
import { ButtonComponent } from '@aum/ui/buttons';
import { InputComponent } from '@aum/ui/form-controls';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'aum-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    ButtonComponent,
    InputComponent,
    TranslateModule,
  ],
  template: `
    <div class="flex-row">
      <div class="flex-column-center-center w-40 ">
        <img class="w-50" src="assets/svgs/A-logo.svg" alt="" />
        <div class="padding-top-16 padding-bottom-16 fs-18 fw-600 w-50">
          <span class="text-left">{{ 'AUM.SIGN_IN' | translate }}</span>
        </div>
        <form [formGroup]="myForm" (ngSubmit)="login()" class="w-50">
          <aum-input
            [label]="'AUM.EMAIL_ADDRESS' | translate"
            [placeholder]="'AUM.ENTER_YOUR_EMAIL' | translate"
            type="email"
            [required]="true"
            [control]="myForm.controls.email"
            [customErrorMessages]="{
             email: 'AUM.INVALID_EMAIL_FORMAT' | translate,
             required: 'AUM.EMAIL_IS_REQUIRED' | translate
           }"
          ></aum-input>
          <aum-input
            [label]="'AUM.PASSWORD' | translate"
            [placeholder]="'AUM.ENTER_PASSWORD' | translate"
            type="password"
            [required]="true"
            [control]="myForm.controls.password"
            [customErrorMessages]="{
             required: 'AUM.PASSWORD_IS_REQUIRED' | translate
           }"
          ></aum-input>

          <aum-button
            class="text-left"
            [type]="'filled'"
            [value]="'AUM.LOGIN' | translate"
            [disabled]="myForm.invalid"
            [htmlType]="'submit'"
            [width]="'100%'"
          ></aum-button>
        </form>
        <div class="margin-top-32 margin-bottom-16">{{ 'AUM.SIGN_IN_WITH' | translate }}</div>
        <div class="flex-row-flex-start w-50">
          <aum-button
            class="text-left"
            [type]="'basic'"
            [value]="'Google'"
          ></aum-button>
          <aum-button
            class="text-left"
            [type]="'basic'"
            [value]="'Facebook'"
          ></aum-button>
          <aum-button
            class="text-left"
            [type]="'basic'"
            [value]="'GitHub'"
          ></aum-button>
        </div>
      </div>
      <div class="w-60 image-block"></div>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: var(--mat-sys-background);
        color: var(--mat-sys-on-background);
        display: block;
        min-height: 100vh;
      }

      .image-block {
        height: 100vh;
        background-image: url('/assets/images/login-banner.jpg');
        background-size: 100% 100%;
      }
    `,
  ],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly myForm: LoginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    //  Clear all classes on body tag
    document.body.className = '';

    //delete later
    this.myForm.patchValue({
      email: 'animesh@mail.com',
    });
  }

  login() {
    if (
      this.myForm.valid &&
      this.auth.login(this.myForm.value.email, this.myForm.value.password)
    ) {
      // After successful login, redirect to the last attempted route or dashboard
      const redirectUrl = this.auth.getLastAttemptedRoute() ?? '/dashboard';
      this.auth.clearLastAttemptedRoute();
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.myForm.markAllAsTouched(); // Show all validation errors
    }
  }
}
