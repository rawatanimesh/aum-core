import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '@aum/ui/form-controls';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-datepicker-examples',
  imports: [DatePickerComponent, DatePipe, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker-examples.html',
})
export class DatepickerExamples {
  selectedDate  = signal<Date | null>(null);
  dateRange     = signal<Date | [Date, Date] | null>(null);
  selectedMonth = signal<Date | [Date, Date] | null>(null);
  selectedYear  = signal<Date | [Date, Date] | null>(null);

  readonly today = new Date();
  readonly maxDate = new Date(this.today.getFullYear() + 1, 11, 31);
}
