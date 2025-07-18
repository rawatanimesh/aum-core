import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerModule,
  MatDateRangeInput,
} from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'aum-date-picker',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'DatePickerComponent',
})
export class DatePickerComponent {
  @Input() label = '';
  @Input() required = false;
  @Input() value: Date | [Date, Date] | null = null;
  @Input() minDate?: Date;
  @Input() maxDate?: Date = new Date();
  @Input() mode: 'date' | 'daterange' | 'month' | 'year' | 'time' = 'date';
  @Input() disabled = false;
  @Output() dateRangeSelected = new EventEmitter<{ start: Date; end: Date }>();
  @Output() dateSelected = new EventEmitter<Date | [Date, Date] | null>();

  @ViewChild(MatDateRangeInput) rangeInput!: MatDateRangeInput<Date>;

  isDate(val: any): val is Date {
    return val instanceof Date && !isNaN(val.getTime());
  }

  onDateRangeChange() {
    const range: any = this.rangeInput.value;
    if (range.start && range.end) {
      this.dateRangeSelected.emit({ start: range.start, end: range.end });
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateSelected.emit(event.value);
  }

  // onTimeChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input && input.value) {
  //     // input.value is in format 'HH:mm' or 'HH:mm:ss'
  //     const [hours, minutes, seconds] = input.value.split(':').map(Number);
  //     const now = new Date();
  //     now.setHours(hours, minutes, seconds || 0, 0);
  //     this.valueChange.emit(now);
  //   } else {
  //     this.valueChange.emit(null);
  //   }
  // }
}
