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
    path: 'layout',
    children: [
      {
        path: '',
        title: 'Layout | UI Lab',
        loadComponent: () =>
          import('./layout/layout-category').then((m) => m.LayoutCategory),
      },
      {
        path: 'card',
        title: 'Card | UI Lab',
        loadComponent: () =>
          import('./layout/card-detail/card-detail').then((m) => m.CardDetail),
      },
      {
        path: 'tabs',
        title: 'Tabs | UI Lab',
        loadComponent: () =>
          import('./layout/tabs-detail/tabs-detail').then((m) => m.TabsDetail),
      },
      {
        path: 'expansion-panel',
        title: 'Expansion Panel | UI Lab',
        loadComponent: () =>
          import('./layout/expansion-panel-detail/expansion-panel-detail').then(
            (m) => m.ExpansionPanelDetail
          ),
      },
      {
        path: 'carousel',
        title: 'Carousel | UI Lab',
        loadComponent: () =>
          import('./layout/carousel-detail/carousel-detail').then(
            (m) => m.CarouselDetail
          ),
      },
    ],
  },
  {
    path: 'navigation',
    children: [
      {
        path: '',
        title: 'Navigation | UI Lab',
        loadComponent: () =>
          import('./navigation/navigation-category').then((m) => m.NavigationCategory),
      },
      {
        path: 'breadcrumb',
        title: 'Breadcrumb | UI Lab',
        loadComponent: () =>
          import('./navigation/breadcrumb-detail/breadcrumb-detail').then((m) => m.BreadcrumbDetail),
      },
      {
        path: 'menu-list',
        title: 'Menu List | UI Lab',
        loadComponent: () =>
          import('./navigation/menu-list-detail/menu-list-detail').then((m) => m.MenuListDetail),
      },
    ],
  },
  {
    path: 'feedback',
    children: [
      {
        path: '',
        title: 'Feedback | UI Lab',
        loadComponent: () =>
          import('./feedback/feedback-category').then((m) => m.FeedbackCategory),
      },
      {
        path: 'snackbar',
        title: 'Snackbar | UI Lab',
        loadComponent: () =>
          import('./feedback/snackbar-detail/snackbar-detail').then((m) => m.SnackbarDetail),
      },
      {
        path: 'generic-dialog',
        title: 'Generic Dialog | UI Lab',
        loadComponent: () =>
          import('./feedback/generic-dialog-detail/generic-dialog-detail').then((m) => m.GenericDialogDetail),
      },
      {
        path: 'confirmation-dialog',
        title: 'Confirmation Dialog | UI Lab',
        loadComponent: () =>
          import('./feedback/confirmation-dialog-detail/confirmation-dialog-detail').then((m) => m.ConfirmationDialogDetail),
      },
    ],
  },
  {
    path: 'utilities',
    children: [
      {
        path: '',
        title: 'Utilities | UI Lab',
        loadComponent: () =>
          import('./utilities/utilities-category').then((m) => m.UtilitiesCategory),
      },
      {
        path: 'icon',
        title: 'Icon | UI Lab',
        loadComponent: () =>
          import('./utilities/icon-detail/icon-detail').then((m) => m.IconDetail),
      },
      {
        path: 'spinner',
        title: 'Spinner | UI Lab',
        loadComponent: () =>
          import('./utilities/spinner-detail/spinner-detail').then((m) => m.SpinnerDetail),
      },
    ],
  },
  {
    path: 'data-display',
    children: [
      {
        path: '',
        title: 'Data Display | UI Lab',
        loadComponent: () =>
          import('./data-display/data-display-category').then((m) => m.DataDisplayCategory),
      },
      {
        path: 'chart',
        title: 'Chart | UI Lab',
        loadComponent: () =>
          import('./data-display/chart-detail/chart-detail').then((m) => m.ChartDetail),
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
