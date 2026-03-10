import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroupDirective,
  NgForm,
  NgControl,
} from '@angular/forms';
import { inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

// Custom ErrorStateMatcher to show errors on dirty, touched, or submitted
export class AumErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'aum-input',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'InputComponent',
})
export class InputComponent {
  @Input() label!: string;
  @Input() type: 'text' | 'email' | 'number' | 'password' = 'text';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() textarea = false;
  @Input() rows = 3;
  @Input() maxlength: number | null = null;
  @Input() readonly = false;
  @Input() disabled = false;

  // --- Forms Integration Inputs/Outputs ---
  @Input() control!: FormControl; // For Reactive Forms
  @Input() data: string | number = ''; // For [(ngModel)] or simple value binding
  @Output() dataChange = new EventEmitter<any>(); // Standard output for [(ngModel)]

  // --- Error Handling ---
  @Input() customErrorMessages: { [key: string]: string } = {}; // Custom error messages
  matcher = new AumErrorStateMatcher(); // ErrorStateMatcher instance
  // --- NgControl handling using inject() ---
  private ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    // If NgControl is present, it means this component is trying to be part of a form.
    // However, if it's not explicitly bound via [formControl] or [(ngModel)],
    // NgModel might implicitly pick it up and throw "unspecified name attribute".
    // Setting valueAccessor to null prevents this implicit behavior.
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  onModelChange(value: any): void {
    if (this.control) {
      this.data = this.control.value;
    } else {
      this.data = value;
    }
    this.dataChange.emit(this.data);
  }
  // --- Error Message Logic ---
  getErrorMessage(): string {
    // Only proceed if a FormControl is actually bound
    if (this.control && this.control.errors) {
      const errors = this.control.errors;

      // Prioritize custom messages
      for (const key in this.customErrorMessages) {
        if (errors[key]) {
          return this.customErrorMessages[key];
        }
      }

      // Fallback to common default messages
      if (errors['required']) return 'This field is required.';
      if (errors['email']) return 'Enter a valid email address.';
      if (errors['minlength'])
        return `Minimum length is ${errors['minlength'].requiredLength}.`;
      if (errors['maxlength'])
        return `Maximum length is ${errors['maxlength'].requiredLength}.`;
      if (errors['pattern']) return 'Invalid format.';
      // Add other specific error messages here if needed for your component's validation types
      // e.g., if (errors['timeFormat']) return 'Invalid time format.';

      return 'Invalid input.'; // Generic fallback
    }
    return ''; // No error message if no control or no errors
  }

  // Check if errors should be displayed
  get showError(): boolean {
    // Show errors only if 'control' is bound, is invalid, and has been interacted with
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty ||
        this.control.touched ||
        (this.control.parent?.touched ?? false))
    );
  }
}
