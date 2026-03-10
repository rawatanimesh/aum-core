import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  inject,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerModule,
  MatDateRangeInput,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import {
  provideNativeDateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  NgControl,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Standard date formats for parsing and display in the date picker.
 * Parse format expects 'YYYY-MM-DD'.
 */
export const AUM_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * Custom ErrorStateMatcher to determine when to show error messages for form controls.
 * Errors are shown if the control is invalid and dirty, touched, or the form has been submitted.
 */
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

/**
 * A reusable date picker component that supports single date and date range selection.
 * It can be used with Angular Reactive Forms via `[control]` or in a standalone manner via `[(data)]`.
 */
@Component({
  selector: 'aum-date-picker',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: AUM_DATE_FORMATS },
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'DatePickerComponent',
})
export class DatePickerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() required = false;
  @Input() minDate?: Date;
  @Input() maxDate?: Date = new Date();
  @Input() mode: 'date' | 'daterange' | 'month' | 'year' = 'date';
  @Input() readonly = false;
  @Input() disabled = false;

  /**
   * Reactive Forms control. For 'date' mode, expects `FormControl`.
   * For 'daterange' mode, expects `FormGroup` with 'start' and 'end' controls.
   */
  @Input() control?: UntypedFormControl | FormGroup;

  /** Internal FormControl used when the component is in standalone mode ('date' mode). */
  internalFormControl: UntypedFormControl = new UntypedFormControl(null);
  /** Internal FormGroup used when the component is in standalone mode ('daterange' mode). */
  internalFormGroup: FormGroup<{
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
  }> = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  /**
   * Data model for standalone mode. For 'date' mode, `Date | null`.
   * For 'daterange' mode, `[Date, Date] | null`.
   */
  @Input() data: Date | [Date, Date] | null = null;
  /** Emits when the `data` model changes in standalone mode. */
  @Output() dataChange = new EventEmitter<Date | [Date, Date] | null>();

  /** Custom error messages to override default validation messages. */
  @Input() customErrorMessages: { [key: string]: string } = {};
  /** Custom error state matcher for the input field. */
  matcher = new AumErrorStateMatcher();

  @Output() dateRangeSelected = new EventEmitter<{
    start: Date;
    end: Date;
  } | null>();
  @Output() dateSelected = new EventEmitter<Date | null>();

  /** Reference to the MatDateRangeInput element in the template. */
  @ViewChild(MatDateRangeInput) rangeInput?: MatDateRangeInput<Date>;

  /** Injected NgControl to prevent the host component from acting as a ControlValueAccessor. */
  private ngControl = inject(NgControl, { optional: true, self: true });
  /** Subject used to manage and unsubscribe from RxJS subscriptions on component destruction. */
  private destroy$ = new Subject<void>();

  constructor() {
    // Prevent the host component from acting as a ControlValueAccessor directly.
    // This allows internal form controls to manage the value accessor logic.
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  /**
   * Initializes the component. Sets up internal form controls if no external control is provided.
   * Also applies initial disabled state.
   */
  ngOnInit(): void {
    if (!this.control) {
      if (this.mode === 'date') {
        this.internalFormControl = new UntypedFormControl(
          this.data,
          this.required ? Validators.required : []
        );
        this.setupInternalControlSync(this.internalFormControl);
      } else if (this.mode === 'daterange') {
        this.internalFormGroup = new FormGroup({
          start: new FormControl<Date | null>(
            this.isArray(this.data) ? this.data[0] : null,
            this.required ? Validators.required : []
          ),
          end: new FormControl<Date | null>(
            this.isArray(this.data) ? this.data[1] : null,
            this.required ? Validators.required : []
          ),
        });
        this.setupInternalControlSync(this.internalFormGroup);
      }
    } else {
      // If external control is provided, set up synchronization.
      if (this.mode === 'date' && this.control instanceof FormControl) {
        this.setupInternalControlSync(this.control);
      } else if (
        this.mode === 'daterange' &&
        this.control instanceof FormGroup
      ) {
        this.setupInternalControlSync(this.control);
      }
    }

    this.applyDisabledState(this.disabled);
  }

  /**
   * Handles changes to component inputs. Updates disabled state and synchronizes
   * standalone data with internal controls.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.applyDisabledState(changes['disabled'].currentValue);
    }

    if (
      changes['data'] &&
      !changes['control'] &&
      this.getActualControl() !== this.control
    ) {
      const actualControl = this.getActualControl();
      if (actualControl) {
        if (this.mode === 'date' && actualControl instanceof FormControl) {
          if (changes['data'].currentValue !== actualControl.value) {
            actualControl.setValue(changes['data'].currentValue, {
              emitEvent: false,
            });
          }
        } else if (
          this.mode === 'daterange' &&
          actualControl instanceof FormGroup
        ) {
          const [start, end] = this.isArray(changes['data'].currentValue)
            ? changes['data'].currentValue
            : [null, null];
          if (
            start !== actualControl.controls['start'].value ||
            end !== actualControl.controls['end'].value
          ) {
            actualControl.controls['start'].setValue(start, {
              emitEvent: false,
            });
            actualControl.controls['end'].setValue(end, { emitEvent: false });
          }
        }
      }
    }
  }

  /**
   * Cleans up RxJS subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Sets up valueChanges subscriptions for the provided control (internal or external).
   * Synchronizes control value with `data` and emits `dataChange` and `dateSelected`/`dateRangeSelected` events.
   * @param controlToSync The FormControl or FormGroup to synchronize.
   */
  private setupInternalControlSync(
    controlToSync: UntypedFormControl | FormGroup
  ): void {
    if (controlToSync instanceof FormControl) {
      controlToSync.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.data = value;
          this.dataChange.emit(value);
          this.dateSelected.emit(value);
        });
      this.data = controlToSync.value;
    } else if (controlToSync instanceof FormGroup) {
      controlToSync.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: { start: Date | null; end: Date | null }) => {
          const range: [Date, Date] | null =
            value.start && value.end ? [value.start, value.end] : null;
          this.data = range;
          this.dataChange.emit(range);
          this.dateSelected.emit(range ? range[0] : null);
          this.dateRangeSelected.emit(
            range ? { start: range[0], end: range[1] } : null
          );
        });
      const initialValue = controlToSync.value;
      this.data =
        initialValue.start && initialValue.end
          ? [initialValue.start, initialValue.end]
          : null;
    }
  }

  /**
   * Applies the disabled state to the active form control.
   * @param isDisabled Boolean indicating whether the control should be disabled.
   */
  private applyDisabledState(isDisabled: boolean): void {
    const actualControl = this.getActualControl();
    if (actualControl) {
      if (isDisabled) {
        actualControl.disable({ emitEvent: false });
      } else {
        actualControl.enable({ emitEvent: false });
      }
    }
  }

  /**
   * Returns the currently active form control (either the external `control` input or the internal one).
   * @returns The active FormControl or FormGroup.
   */
  public getActualControl(): UntypedFormControl | FormGroup {
    if (this.control) {
      return this.control;
    } else if (this.mode === 'date') {
      return this.internalFormControl;
    } else {
      // daterange
      return this.internalFormGroup;
    }
  }

  /**
   * Returns the FormControl instance for single date selection, or null.
   * Used for template binding to `[formControl]`.
   */
  public get formControlForSingleDate(): FormControl | null {
    const actualControl = this.getActualControl();
    return this.isFormControl(actualControl) ? actualControl : null;
  }

  /**
   * Returns the FormGroup instance for date range selection, or null.
   * Used for template binding to `[formGroup]`.
   */
  public get formGroupForDateRange(): FormGroup | null {
    const actualControl = this.getActualControl();
    return this.isFormGroup(actualControl) ? actualControl : null;
  }

  /**
   * Type guard to check if a value is a Date object.
   * @param val The value to check.
   */
  public isDate(val: any): val is Date {
    return val instanceof Date && !isNaN(val.getTime());
  }

  /**
   * Type guard to check if a value is an array.
   * @param val The value to check.
   */
  public isArray(val: any): val is any[] {
    return Array.isArray(val);
  }

  /**
   * Type guard to check if a control is an instance of FormControl.
   * @param ctrl The control to check.
   */
  public isFormControl(
    ctrl: UntypedFormControl | FormGroup
  ): ctrl is FormControl {
    return ctrl instanceof FormControl;
  }

  /**
   * Type guard to check if a control is an instance of FormGroup.
   * @param ctrl The control to check.
   */
  public isFormGroup(ctrl: UntypedFormControl | FormGroup): ctrl is FormGroup {
    return ctrl instanceof FormGroup;
  }

  /**
   * Event handler for single date input changes. Marks the control as touched.
   * @param event The MatDatepickerInputEvent.
   */
  onSingleInputDateChange(event: MatDatepickerInputEvent<Date>): void {
    const actualControl = this.getActualControl();
    if (this.isFormControl(actualControl)) {
      actualControl.markAsTouched();
    }
  }

  /**
   * Event handler for date range picker closing. Marks the controls as touched.
   */
  onRangePickerClosed(): void {
    const actualControl = this.getActualControl();
    if (this.isFormGroup(actualControl)) {
      actualControl.controls['start'].markAsTouched();
      actualControl.controls['end'].markAsTouched();
    }
  }

  /**
   * Clears the selected date(s) and marks the control(s) as dirty and touched.
   * @param event The DOM event.
   */
  public clearDate(event: Event): void {
    event.stopPropagation();
    const actualControl = this.getActualControl();
    if (this.isFormControl(actualControl)) {
      actualControl.setValue(null);
      actualControl.markAsDirty();
      actualControl.markAsTouched();
    } else if (this.isFormGroup(actualControl)) {
      actualControl.controls['start'].setValue(null);
      actualControl.controls['end'].setValue(null);
      actualControl.controls['start'].markAsDirty();
      actualControl.controls['end'].markAsDirty();
      actualControl.controls['start'].markAsTouched();
      actualControl.controls['end'].markAsTouched();
    }
  }

  /**
   * Returns the appropriate error message based on the control's current errors.
   * Prioritizes custom messages, then specific Material errors, then generic messages.
   */
  public getErrorMessage(): string {
    const actualControl = this.getActualControl();
    if (!actualControl) return '';

    if (this.isFormControl(actualControl)) {
      if (
        actualControl.errors &&
        (actualControl.dirty ||
          actualControl.touched ||
          !!actualControl.parent?.touched)
      ) {
        const errors = actualControl.errors;
        for (const key in this.customErrorMessages) {
          if (errors[key]) return this.customErrorMessages[key];
        }
        if (errors['matDatepickerMin']) return 'Date is too early.';
        if (errors['matDatepickerMax']) return 'Date is too late.';
        if (errors['matDatepickerFilter']) return 'Date is not allowed.';
        if (errors['matDatepickerParse']) return 'Invalid date format.';
        if (errors['required']) return 'This field is required.';
      }
    } else if (this.isFormGroup(actualControl)) {
      const startControl = actualControl.controls['start'];
      const endControl = actualControl.controls['end'];

      if (this.required && !startControl.value && !endControl.value) {
        if (
          startControl.dirty ||
          startControl.touched ||
          endControl.dirty ||
          endControl.touched ||
          !!actualControl.parent?.touched
        ) {
          return (
            this.customErrorMessages['required'] || 'Date range is required.'
          );
        }
      }

      // Check start date errors
      if (
        startControl.errors &&
        (startControl.dirty ||
          startControl.touched ||
          !!actualControl.parent?.touched)
      ) {
        const errors = startControl.errors;
        for (const key in this.customErrorMessages) {
          if (errors[key]) return this.customErrorMessages[key];
        }
        if (errors['matDatepickerMin']) return 'Start date is too early.';
        if (errors['matDatepickerMax']) return 'Start date is too late.';
        if (errors['matDatepickerParse']) return 'Invalid start date format.';
      }

      // Check end date errors
      if (
        endControl.errors &&
        (endControl.dirty ||
          endControl.touched ||
          !!actualControl.parent?.touched)
      ) {
        const errors = endControl.errors;
        for (const key in this.customErrorMessages) {
          if (errors[key]) return this.customErrorMessages[key];
        }
        if (errors['matDatepickerMin']) return 'End date is too early.';
        if (errors['matDatepickerMax']) return 'End date is too late.';
        if (errors['matDatepickerParse']) return 'Invalid end date format.';
      }

      // Check date range specific errors
      if (
        actualControl.errors &&
        (startControl.dirty ||
          startControl.touched ||
          endControl.dirty ||
          endControl.touched ||
          !!actualControl.parent?.touched)
      ) {
        if (actualControl.hasError('matDateRangePickerParse'))
          return 'Invalid date range format.';
        if (actualControl.hasError('matDateRangeInput'))
          return 'Invalid date range.';
        if (actualControl.hasError('matEndDateInvalid'))
          return 'End date cannot be before start date.';
      }
    }
    return '';
  }

  /**
   * Determines if error messages should be displayed for the active control.
   */
  public get showError(): boolean {
    const actualControl = this.getActualControl();
    if (!actualControl) return false;

    if (this.isFormControl(actualControl)) {
      return (
        actualControl.invalid &&
        (actualControl.dirty ||
          actualControl.touched ||
          !!actualControl.parent?.touched)
      );
    } else if (this.isFormGroup(actualControl)) {
      const startControl = actualControl.controls['start'];
      const endControl = actualControl.controls['end'];

      const isRequiredInvalid =
        this.required &&
        !startControl.value &&
        !endControl.value &&
        (startControl.touched ||
          endControl.touched ||
          startControl.dirty ||
          endControl.dirty);

      return (
        (actualControl.invalid &&
          (actualControl.dirty ||
            actualControl.touched ||
            !!actualControl.parent?.touched ||
            startControl.dirty ||
            startControl.touched ||
            endControl.dirty ||
            endControl.touched)) ||
        isRequiredInvalid
      );
    }
    return false;
  }
}
