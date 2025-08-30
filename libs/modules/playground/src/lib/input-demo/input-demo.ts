import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PageComponent } from '@aum/ui/layout';
import {
  InputComponent,
  DatePickerComponent,
  SelectBox,
  SelectOption,
} from '@aum/ui/form-controls';
import { ButtonComponent } from '@aum/ui/buttons';

// Define a type for your form structure for better type safety
type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  username: FormControl<string>;
  notes: FormControl<string>;
  someDate: FormControl<Date | null>;

  someDateRange: FormGroup<{
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
  }>;
  country: FormControl<string>;
  multiSelectHobbies: FormControl<string[]>;
}>;

@Component({
  selector: 'playground-input-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageComponent,
    InputComponent,
    DatePickerComponent,
    SelectBox,
    ButtonComponent,
  ],
  templateUrl: './input-demo.html',
  styleUrl: './input-demo.scss',
})
export class InputDemo implements OnInit, OnDestroy {
  pageInfo = {
    breadcrumbs: [
      { title: 'Playground', route: '/playground' },
      { title: 'Inputs', route: '/playground/inputs' },
    ],
  };
  fruitOptions: SelectOption[] = [
    { value: 'apple', text: 'Apple' },
    { value: 'banana', text: 'Banana', disabled: true },
    { value: 'orange', text: 'Orange' },
  ];
  colorOptions: SelectOption[] = [
    { value: 'red', text: 'Red' },
    { value: 'blue', text: 'Blue', disabled: true },
    { value: 'green', text: 'Green' },
  ];
  selectedFruit = 'banana';
  selectedColors = ['red', 'blue'];

  countryOptions: SelectOption[] = [
    { value: '', text: 'Select a Country' }, // Optional: a default disabled option
    { value: 'USA', text: 'United States' },
    { value: 'Canada', text: 'Canada' },
    { value: 'Mexico', text: 'Mexico' },
    { value: 'UK', text: 'United Kingdom' },
    { value: 'Germany', text: 'Germany' },
  ];

  hobbyOptions: SelectOption[] = [
    { value: 'reading', text: 'Reading' },
    { value: 'hiking', text: 'Hiking' },
    { value: 'gaming', text: 'Gaming' },
    { value: 'cooking', text: 'Cooking' },
  ];

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  inputValue1 = 'Test value 1';
  inputValue2 = 'Test value 2';
  inputValue3 = 'Test value 3';

  minAllowedDate = new Date(2023, 0, 1);
  maxAllowedDate = new Date(2025, 11, 31);

  // --- Standalone (Template-Driven) Setup ---
  standaloneSingleDate: Date | null = new Date();
  standaloneDateRange: [Date, Date] | null = [
    new Date(2024, 0, 1),
    new Date(2024, 0, 15),
  ];

  private destroy$ = new Subject<void>();
  readonly myForm: LoginForm = new FormGroup({
    email: new FormControl('', {
      // Initial value empty
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        // Custom validator to disallow '123456'
        Validators.pattern(/^(?!123456$).*$/),
      ],
    }),
    username: new FormControl('defaultUser', {
      // Initial value 'defaultUser'
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    notes: new FormControl('Initial notes for the textarea.', {
      // Initial value for textarea
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    someDate: new FormControl<Date | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    someDateRange: new FormGroup({
      start: new FormControl<Date | null>(null, [Validators.required]),
      end: new FormControl<Date | null>(null, [Validators.required]),
    }),
    country: new FormControl<string>('USA', {
      // 'USA' as initial value
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^(USA|Canada|Mexico)$/),
      ], // Example pattern validator
    }),
    multiSelectHobbies: new FormControl<string[]>([], {
      // Example for multiple select
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });
  constructor() {
    // Example: Watch value changes of the daterange form group
    this.myForm.controls.someDateRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log('Reactive Form Date Range Value:', value);
      });

    // You can also subscribe to overall form value/status changes here if needed
    this.myForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log('Overall Form Value:', value);
      });
    this.myForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        console.log('Overall Form Status:', status);
      });
  }
  ngOnInit(): void {
    this.myForm.controls.someDate.setValue(new Date(2024, 6, 10)); // July 10, 2024
    this.myForm.controls.someDateRange.controls.start.setValue(
      new Date(2024, 7, 1)
    ); // August 1, 2024
    this.myForm.controls.someDateRange.controls.end.setValue(
      new Date(2024, 7, 15)
    ); // August 15, 2024

    // Set initial values for standalone (Template-Driven)
    this.standaloneSingleDate = new Date(2024, 8, 5);
    this.standaloneDateRange = [new Date(2024, 9, 10), new Date(2024, 9, 20)];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  valueChange(ev: any) {
    console.log('valueChange', ev);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form Submitted Successfully!', this.myForm.value);
    } else {
      console.warn('Form is Invalid!', this.myForm.value);
      this.myForm.markAllAsTouched(); // Show all validation errors
    }
  }

  // Reset form to its initial state
  resetForm(): void {
    this.myForm.reset({
      email: '',
      password: '',
      username: '',
      notes: '',
      someDate: null,
      someDateRange: { start: null, end: null },
      country: '',
      multiSelectHobbies: [],
    });
    this.standaloneSingleDate = null;
    this.standaloneDateRange = null;
  }

  setStandaloneValues(): void {
    this.standaloneSingleDate = new Date(2024, 10, 25); // November 25, 2024
    this.standaloneDateRange = [new Date(2024, 11, 1), new Date(2024, 11, 25)]; // December 2024
    this.selectedFruit = 'apple';
    this.selectedColors = ['green', 'red'];
  }

  togglePasswordEnabled(): void {
    // Example from your previous code, ensure it still works with new form structure
    const passwordControl = this.myForm.controls.password;
    if (passwordControl.disabled) {
      passwordControl.enable();
    } else {
      passwordControl.disable();
    }
  }

  // Patch values to the form (e.g., loading existing data)
  patchFormValues(): void {
    // Example from your previous code, ensure it still works with new form structure
    this.myForm.patchValue({
      email: 'patched@example.com',
      password: 'newpassword',
      username: 'patchedUser',
      notes: 'These are some patched notes.',
      someDate: new Date(2024, 7, 15), // Patch single date
      someDateRange: {
        // Patch date range
        start: new Date(2024, 8, 1),
        end: new Date(2024, 8, 10),
      },
      country: 'Canada',
      multiSelectHobbies: ['hiking', 'cooking'],
    });
  }
  dateSelected(ev: any) {
    console.log(ev);
  }
  selectValueChange(ev: any) {
    console.log(ev);
  }
}
