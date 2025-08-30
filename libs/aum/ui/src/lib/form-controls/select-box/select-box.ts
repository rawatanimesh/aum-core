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
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
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
import { MatSelectChange } from '@angular/material/select';

export interface SelectOption {
  value: any;
  text: string;
  disabled?: boolean;
}

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
  selector: 'aum-select-box',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './select-box.html',
  styleUrl: './select-box.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBox {
  @Input() label!: string;
  @Input() required = false;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() multiple = false;

  // Input for the list of options
  @Input() optionList: SelectOption[] = [];

  // Initialize compareWith with a default function that uses strict equality
  // Function to compare objects in mat-select, useful for complex objects as values
  @Input() compareWith: (o1: any, o2: any) => boolean = (o1: any, o2: any) =>
    o1 === o2;

  // --- Forms Integration Inputs/Outputs ---
  @Input() control!: FormControl; // For Reactive Forms
  @Input() data: any | any[] = null; // For [(ngModel)] or simple value binding (can be array for multiple)
  @Output() dataChange = new EventEmitter<any | any[]>(); // Standard output for [(ngModel)]

  // --- Error Handling ---
  @Input() customErrorMessages: { [key: string]: string } = {}; // Custom error messages
  matcher = new AumErrorStateMatcher(); // ErrorStateMatcher instance

  // --- NgControl handling using inject() ---
  private ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    // If NgControl is present, it means this component is trying to be part of a form.
    // Setting valueAccessor to null prevents implicit NgModel behavior if not explicitly bound.
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  onSelectionChange(event: MatSelectChange): void {
    if (this.control) {
      // If Reactive Forms, the control's value is already updated by Angular Forms.
      // We just need to emit the value for consistency if dataChange is also used.
      this.data = this.control.value;
    } else {
      // If NgModel, update the internal 'data' property
      this.data = event.value;
    }
    this.dataChange.emit(this.data);
  }

  // --- Error Message Logic ---
  getErrorMessage(): string {
    // Only proceed if a FormControl is actually bound and has errors
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

      return 'Invalid selection.'; // Generic fallback for select specific errors
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
