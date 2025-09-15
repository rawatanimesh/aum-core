import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { Observable, of } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Re-using the SelectOption interface from your select-box
export interface SelectOption {
  value: any; // The actual value bound to the model
  text: string; // The text displayed to the user
  disabled?: boolean;
}

// Re-using the AumErrorStateMatcher from your input/select-box
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
  selector: 'aum-autocomplete',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete implements OnInit {
  @Input() label!: string;
  @Input() required = false;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;

  // Input for the list of all available options
  @Input() optionList: SelectOption[] = [];

  // Observable for filtered options that will be displayed in the autocomplete panel
  filteredOptions!: Observable<SelectOption[]>;

  // --- Forms Integration Inputs/Outputs ---
  // control will hold the 'value' part of SelectOption
  @Input() control!: FormControl<any | null>; // For Reactive Forms
  @Input() data: any | null = null; // For [(ngModel)] or simple value binding

  // Emits the 'value' part of the selected SelectOption
  @Output() dataChange = new EventEmitter<any | null>();

  // --- Error Handling ---
  @Input() customErrorMessages: { [key: string]: string } = {};
  matcher = new AumErrorStateMatcher();

  // --- NgControl handling using inject() ---
  private ngControl = inject(NgControl, { optional: true, self: true });

  // Internal subject for ngModel changes to drive filtering
  private _ngModelSubject = new EventEmitter<any>();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  ngOnInit(): void {
    // Determine the source of value changes for filtering
    const valueChangesSource$ = this.control
      ? this.control.valueChanges
      : this._ngModelSubject.asObservable();

    this.filteredOptions = valueChangesSource$.pipe(
      startWith(this.control ? this.control.value : this.data || ''), // Start with current control/data value
      map((value) => {
        // If the value is an object, convert it to its display string for filtering
        if (value && typeof value === 'object') {
          return this.displayFn(value);
        }
        // If it's already a string (user typing), return it directly
        return value || '';
      }),
      filter((value) => value !== null && value !== undefined), // Filter out null/undefined values
      map((name) => (name ? this._filter(name) : this.optionList.slice())) // Perform filtering
    );
  }

  // This function is crucial for displaying the selected object's text in the input field
  // It receives the 'value' part of the SelectOption
  displayFn = (value: any): string => {
    // If 'value' is an object (i.e., it's a selected option's value)
    if (value && typeof value === 'object') {
      const selectedOption = this.optionList.find((option) => {
        // This comparison logic should match how you uniquely identify your 'value' objects.
        // Assuming 'value' objects have an 'id' property. Adjust as needed.
        if (
          option.value &&
          typeof option.value === 'object' &&
          option.value.id !== undefined
        ) {
          return option.value.id === value.id;
        }
        // Fallback for primitive values or if 'id' is not present in object
        return option.value === value;
      });
      return selectedOption ? selectedOption.text : '';
    }
    // If 'value' is a string (user typing), return it directly
    return value || '';
  };

  // Handles input changes from the user (for ngModel/standalone)
  // This is where we feed the _ngModelSubject
  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (!this.control) {
      // Only for ngModel/standalone
      this._ngModelSubject.next(inputValue);
      // If user clears the input, and it's not a valid option, emit null
      if (inputValue === '') {
        this.dataChange.emit(null);
        this.data = null; // Update internal data for consistency
      }
    }
  }

  // Handles when an option is selected from the autocomplete dropdown
  onOptionSelection(event: MatAutocompleteSelectedEvent): void {
    // event.option.value contains the value of the selected mat-option
    // which is 'option.value' from our SelectOption
    const selectedValue = event.option.value;
    this.dataChange.emit(selectedValue);
    // If using ngModel, update the internal 'data' property directly
    if (!this.control) {
      this.data = selectedValue;
      this._ngModelSubject.next(selectedValue); // Update subject to reflect selection
    }
  }

  // --- Filtering logic ---
  private _filter(value: string): SelectOption[] {
    const filterValue = value.toLowerCase();
    return this.optionList.filter((option) =>
      option.text.toLowerCase().includes(filterValue)
    );
  }

  // --- Error Message Logic (re-used from your existing components) ---
  getErrorMessage(): string {
    if (this.control && this.control.errors) {
      const errors = this.control.errors;

      for (const key in this.customErrorMessages) {
        if (errors[key]) {
          return this.customErrorMessages[key];
        }
      }

      if (errors['required']) return 'This field is required.';
      // Add specific validation for autocomplete, e.g., if value is not in optionList
      // You might add a custom validator at the form control level for this.
      // e.g., if (errors['noMatch']) return 'Please select a valid option from the list.';

      return 'Invalid input.';
    }
    return '';
  }

  // Check if errors should be displayed (re-used from your existing components)
  get showError(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty ||
        this.control.touched ||
        (this.control.parent?.touched ?? false))
    );
  }
}
