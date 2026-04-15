import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ButtonToggleComponent, ButtonToggleOption } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';

@Component({
  selector: 'ui-lab-button-toggle-examples',
  imports: [JsonPipe, ButtonToggleComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-toggle-examples.html',
})
export class ButtonToggleExamples {
  singleSelection = signal<string | string[]>('day');
  iconSelection = signal<string | string[]>('list');
  multipleSelection = signal<string | string[]>(['bold', 'underline']);
  alignSelection = signal<string | string[]>('align_left');

  singleOptions: ButtonToggleOption[] = [
    { label: 'Day', value: 'day', selected: true },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  iconOptions: ButtonToggleOption[] = [
    { label: 'List', value: 'list', icon: 'list', selected: true },
    { label: 'Grid', value: 'grid', icon: 'grid_view' },
    { label: 'Table', value: 'table', icon: 'table_chart' },
  ];

  multipleOptions: ButtonToggleOption[] = [
    { label: 'Bold', value: 'bold', icon: 'format_bold', selected: true },
    { label: 'Italic', value: 'italic', icon: 'format_italic' },
    { label: 'Underline', value: 'underline', icon: 'format_underlined', selected: true },
    { label: 'Strike', value: 'strikethrough', icon: 'format_strikethrough' },
  ];

  sizeOptions: ButtonToggleOption[] = [
    { label: 'All', value: 'all', selected: true },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  disabledOptions: ButtonToggleOption[] = [
    { label: 'Option A', value: 'a', selected: true },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  iconOnlyOptions: ButtonToggleOption[] = [
    { label: '', value: 'align_left', icon: 'format_align_left', selected: true },
    { label: '', value: 'align_center', icon: 'format_align_center' },
    { label: '', value: 'align_right', icon: 'format_align_right' },
    { label: '', value: 'align_justify', icon: 'format_align_justify' },
  ];
}
