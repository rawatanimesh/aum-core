import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from '@aum/ui/layout';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

interface ComponentCard {
  nameKey: string;
  selector: string;
  descKey: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'demo-form-controls-category',
  imports: [RouterModule, PageComponent, Icon, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-controls-category.html',
  styleUrl: './form-controls-category.scss',
})
export class FormControlsCategory {
  pageInfo = {
    breadcrumbs: [
      { title: 'UI_LAB', route: '/ui-lab' },
      { title: 'UI_LAB_FORM_CONTROLS', route: '/ui-lab/form-controls' },
    ],
  };

  readonly components: ComponentCard[] = [
    {
      nameKey: 'UI_LAB_INPUT',
      selector: '<aum-input>',
      descKey: 'UI_LAB_COMP_INPUT_DESC',
      route: '/ui-lab/form-controls/input',
      icon: 'text_fields',
    },
    {
      nameKey: 'UI_LAB_CHECKBOX',
      selector: '<aum-checkbox>',
      descKey: 'UI_LAB_COMP_CHECKBOX_DESC',
      route: '/ui-lab/form-controls/checkbox',
      icon: 'check_box',
    },
    {
      nameKey: 'UI_LAB_RADIO',
      selector: '<aum-radio-button>',
      descKey: 'UI_LAB_COMP_RADIO_DESC',
      route: '/ui-lab/form-controls/radio',
      icon: 'radio_button_checked',
    },
    {
      nameKey: 'UI_LAB_SELECT',
      selector: '<aum-select-box>',
      descKey: 'UI_LAB_COMP_SELECT_DESC',
      route: '/ui-lab/form-controls/select',
      icon: 'list',
    },
    {
      nameKey: 'UI_LAB_DATEPICKER',
      selector: '<aum-date-picker>',
      descKey: 'UI_LAB_COMP_DATEPICKER_DESC',
      route: '/ui-lab/form-controls/datepicker',
      icon: 'calendar_today',
    },
    {
      nameKey: 'UI_LAB_AUTOCOMPLETE',
      selector: '<aum-autocomplete>',
      descKey: 'UI_LAB_COMP_AUTOCOMPLETE_DESC',
      route: '/ui-lab/form-controls/autocomplete',
      icon: 'search',
    },
  ];
}
