import type { ApiRow } from '../shared/api-table/api-table';

export const DATEPICKER_META = {
  name: 'Date Picker',
  selector: 'aum-date-picker',
  importFrom: '@aum/ui/form-controls',
  description:
    'Date picker with four modes: single date, date range, month, and year. Supports min/max date constraints and reactive form integration.',
  status: 'stable' as const,
};

export const DATEPICKER_INPUTS: ApiRow[] = [
  { name: 'label', type: 'string', default: "''", description: 'Label shown above the picker.' },
  { name: 'mode', type: "'date' | 'daterange' | 'month' | 'year'", default: "'date'", description: 'Picker mode controlling calendar granularity.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows the value without allowing edits.' },
  { name: 'minDate', type: 'Date | undefined', default: 'undefined', description: 'Earliest selectable date.' },
  { name: 'maxDate', type: 'Date', default: 'new Date()', description: 'Latest selectable date (defaults to today).' },
  { name: 'control', type: 'FormControl | FormGroup', description: 'Reactive form control or group (daterange uses FormGroup).' },
  { name: 'data', type: 'Date | [Date, Date] | null', default: 'null', description: 'Standalone value binding.' },
];

export const DATEPICKER_OUTPUTS: ApiRow[] = [
  { name: 'dateSelected', type: 'EventEmitter<Date | null>', description: 'Emits the selected date in single-date mode.' },
  { name: 'dateRangeSelected', type: "EventEmitter<{ start: Date; end: Date } | null>", description: 'Emits the selected range in daterange mode.' },
  { name: 'dataChange', type: 'EventEmitter<Date | [Date, Date] | null>', description: 'Emits new value for standalone usage.' },
];

export const DATEPICKER_EXAMPLES = {
  importPath: `import { DatePickerComponent } from '@aum/ui/form-controls';`,

  basicUsage: `<aum-date-picker
  label="Date of Birth"
  [(data)]="dob"
  (dateSelected)="onDateSelected($event)"
></aum-date-picker>`,

  dateRange: `<aum-date-picker
  label="Booking Range"
  mode="daterange"
  [(data)]="dateRange"
  (dateRangeSelected)="onRangeSelected($event)"
></aum-date-picker>

// dateRange: [Date, Date] | null = null`,

  monthYear: `<!-- Month picker -->
<aum-date-picker
  label="Billing Month"
  mode="month"
  [(data)]="selectedMonth"
></aum-date-picker>

<!-- Year picker -->
<aum-date-picker
  label="Fiscal Year"
  mode="year"
  [(data)]="selectedYear"
></aum-date-picker>`,

  states: `<!-- Disabled -->
<aum-date-picker label="Disabled" [disabled]="true"></aum-date-picker>

<!-- With min/max constraints -->
<aum-date-picker
  label="Appointment"
  [minDate]="today"
  [maxDate]="maxDate"
></aum-date-picker>`,
};
