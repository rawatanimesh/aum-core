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
  Autocomplete,
  SlideToggle,
} from '@aum/ui/form-controls';
import { ButtonComponent } from '@aum/ui/buttons';

interface Product {
  id: number;
  name: string;
  category: string;
}

type MyForm = FormGroup<{
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
  programmingLanguage: FormControl<string | null>;
  selectedProduct: FormControl<Product | null>;
}>;

@Component({
  selector: 'demo-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageComponent,
    InputComponent,
    DatePickerComponent,
    SelectBox,
    Autocomplete,
    ButtonComponent,
    SlideToggle,
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

  boldLabel = true;
  size: 'medium' | 'large' = 'medium';

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

  capitalOptions: SelectOption[] = [
    { value: 'Paris', text: 'Paris' },
    { value: 'Tokyo', text: 'Tokyo' },
    { value: 'London', text: 'London' },
    { value: 'Berlin', text: 'Berlin' },
    { value: 'Rome', text: 'Rome' },
  ];

  programmingLanguageOptions: SelectOption[] = [
    { value: 'JavaScript', text: 'JavaScript' },
    { value: 'Python', text: 'Python' },
    { value: 'Java', text: 'Java' },
    { value: 'C#', text: 'C#' },
    { value: 'TypeScript', text: 'TypeScript' },
    { value: 'Ruby', text: 'Ruby' },
    { value: 'Go', text: 'Go' },
  ];

  productOptions: SelectOption[] = [
    { value: { id: 101, name: 'Laptop', category: 'Electronics' }, text: 'Laptop (Electronics)' },
    { value: { id: 102, name: 'Mouse', category: 'Electronics' }, text: 'Mouse (Electronics)' },
    { value: { id: 201, name: 'T-Shirt', category: 'Apparel' }, text: 'T-Shirt (Apparel)' },
    { value: { id: 301, name: 'Smartphone', category: 'Mobile' }, text: 'Smartphone (Mobile)' },
    { value: { id: 401, name: 'Book', category: 'Books' }, text: 'Book (Books)' },
  ];

  inputValue1 = 'Test value 1';
  inputValue2 = 'Test value 2';
  inputValue3 = 'Test value 3';

  minAllowedDate = new Date(2023, 0, 1);
  maxAllowedDate = new Date(2025, 11, 31);

  standaloneSingleDate: Date | null = new Date();
  standaloneDateRange: [Date, Date] | null = [new Date(2024, 0, 1), new Date(2024, 0, 15)];
  selectedCapital: string | null = null;

  private destroy$ = new Subject<void>();

  readonly myForm: MyForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^(?!123456$).*$/),
      ],
    }),
    username: new FormControl('defaultUser', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    notes: new FormControl('Initial notes for the textarea.', {
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
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^(USA|Canada|Mexico)$/)],
    }),
    multiSelectHobbies: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    programmingLanguage: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    selectedProduct: new FormControl<Product | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.myForm.controls.someDateRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => console.log('Date Range:', value));
  }

  ngOnInit(): void {
    this.myForm.controls.someDate.setValue(new Date(2024, 6, 10));
    this.myForm.controls.someDateRange.controls.start.setValue(new Date(2024, 7, 1));
    this.myForm.controls.someDateRange.controls.end.setValue(new Date(2024, 7, 15));
    this.myForm.controls.programmingLanguage.setValue('TypeScript');
    this.myForm.controls.selectedProduct.setValue(this.productOptions[2].value);
    this.standaloneSingleDate = new Date(2024, 8, 5);
    this.standaloneDateRange = [new Date(2024, 9, 10), new Date(2024, 9, 20)];
    this.selectedCapital = 'Tokyo';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  valueChange(ev: any): void {
    console.log('valueChange', ev);
  }

  selectValueChange(ev: any): void {
    console.log('selectValueChange', ev);
  }

  dateSelected(ev: any): void {
    console.log('dateSelected', ev);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form submitted', this.myForm.value);
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  togglePasswordEnabled(): void {
    const ctrl = this.myForm.controls.password;
    ctrl.disabled ? ctrl.enable() : ctrl.disable();
  }

  patchFormValues(): void {
    this.myForm.patchValue({
      email: 'patched@example.com',
      password: 'newpassword',
      username: 'patchedUser',
      notes: 'These are some patched notes.',
      someDate: new Date(2024, 7, 15),
      someDateRange: { start: new Date(2024, 8, 1), end: new Date(2024, 8, 10) },
      country: 'Canada',
      multiSelectHobbies: ['hiking', 'cooking'],
      programmingLanguage: 'Python',
      selectedProduct: this.productOptions[0].value,
    });
  }

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
      programmingLanguage: null,
      selectedProduct: null,
    });
    this.standaloneSingleDate = null;
    this.standaloneDateRange = null;
  }
}
