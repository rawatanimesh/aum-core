import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from '@aum/ui/layout';
import { ButtonToggleComponent, ButtonToggleOption } from '@aum/ui/buttons';

@Component({
  selector: 'demo-button-toggle',
  standalone: true,
  imports: [CommonModule, PageComponent, ButtonToggleComponent],
  templateUrl: './button-toggle-demo.html',
  styleUrl: './button-toggle-demo.scss',
})
export class ButtonToggleDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'BUTTON_TOGGLE', route: '/playground/button-toggle' },
    ],
  };

  // Scenario 1: Single selection, label only
  singleOptions: ButtonToggleOption[] = [
    { label: 'Day', value: 'day', selected: true },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];
  singleSelection: string | string[] = 'day';

  // Scenario 2: Single selection with icons
  iconOptions: ButtonToggleOption[] = [
    { label: 'List', value: 'list', icon: 'list', selected: true },
    { label: 'Grid', value: 'grid', icon: 'grid_view' },
    { label: 'Table', value: 'table', icon: 'table_chart' },
  ];
  iconSelection: string | string[] = 'list';

  // Scenario 3: Multiple selection
  multipleOptions: ButtonToggleOption[] = [
    { label: 'Bold', value: 'bold', icon: 'format_bold', selected: true },
    { label: 'Italic', value: 'italic', icon: 'format_italic' },
    { label: 'Underline', value: 'underline', icon: 'format_underlined', selected: true },
    { label: 'Strike', value: 'strikethrough', icon: 'format_strikethrough' },
  ];
  multipleSelection: string | string[] = ['bold', 'underline'];

  // Scenario 4: Size - small
  sizeSmallOptions: ButtonToggleOption[] = [
    { label: 'All', value: 'all', selected: true },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Scenario 5: Size - large
  sizeLargeOptions: ButtonToggleOption[] = [
    { label: 'All', value: 'all', selected: true },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Scenario 6: Disabled group
  disabledOptions: ButtonToggleOption[] = [
    { label: 'Option A', value: 'a', selected: true },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  // Scenario 7: Icons only (no label text — icon speaks for itself)
  iconOnlyOptions: ButtonToggleOption[] = [
    { label: '', value: 'align_left', icon: 'format_align_left', selected: true },
    { label: '', value: 'align_center', icon: 'format_align_center' },
    { label: '', value: 'align_right', icon: 'format_align_right' },
    { label: '', value: 'align_justify', icon: 'format_align_justify' },
  ];
  alignSelection: string | string[] = 'align_left';

  onSelectionChange(scenario: string, value: string | string[]) {
    console.log(`[${scenario}] selection:`, value);
  }
}
