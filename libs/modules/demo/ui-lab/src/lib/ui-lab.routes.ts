import { Routes } from '@angular/router';

export const uiLabRoutes: Routes = [
  {
    path: '',
    title: 'UI Lab | Aum Core',
    loadComponent: () =>
      import('./catalog/ui-lab-catalog').then((m) => m.UiLabCatalog),
  },
  {
    path: 'buttons',
    children: [
      {
        path: '',
        title: 'Buttons | UI Lab',
        loadComponent: () =>
          import('./buttons/buttons-category').then((m) => m.ButtonsCategory),
      },
      {
        path: 'button',
        title: 'Button | UI Lab',
        loadComponent: () =>
          import('./buttons/button-detail/button-detail').then(
            (m) => m.ButtonDetail
          ),
      },
      {
        path: 'button-toggle',
        title: 'Button Toggle | UI Lab',
        loadComponent: () =>
          import(
            './buttons/button-toggle-detail/button-toggle-detail'
          ).then((m) => m.ButtonToggleDetail),
      },
    ],
  },
  {
    path: 'form-controls',
    children: [
      {
        path: '',
        title: 'Form Controls | UI Lab',
        loadComponent: () =>
          import('./form-controls/form-controls-category').then(
            (m) => m.FormControlsCategory
          ),
      },
      {
        path: 'input',
        title: 'Input | UI Lab',
        loadComponent: () =>
          import('./form-controls/input-detail/input-detail').then(
            (m) => m.InputDetail
          ),
      },
      {
        path: 'checkbox',
        title: 'Checkbox | UI Lab',
        loadComponent: () =>
          import('./form-controls/checkbox-detail/checkbox-detail').then(
            (m) => m.CheckboxDetail
          ),
      },
      {
        path: 'radio',
        title: 'Radio | UI Lab',
        loadComponent: () =>
          import('./form-controls/radio-detail/radio-detail').then(
            (m) => m.RadioDetail
          ),
      },
      {
        path: 'select',
        title: 'Select | UI Lab',
        loadComponent: () =>
          import('./form-controls/select-detail/select-detail').then(
            (m) => m.SelectDetail
          ),
      },
      {
        path: 'datepicker',
        title: 'Date Picker | UI Lab',
        loadComponent: () =>
          import('./form-controls/datepicker-detail/datepicker-detail').then(
            (m) => m.DatepickerDetail
          ),
      },
      {
        path: 'autocomplete',
        title: 'Autocomplete | UI Lab',
        loadComponent: () =>
          import(
            './form-controls/autocomplete-detail/autocomplete-detail'
          ).then((m) => m.AutocompleteDetail),
      },
    ],
  },
];
