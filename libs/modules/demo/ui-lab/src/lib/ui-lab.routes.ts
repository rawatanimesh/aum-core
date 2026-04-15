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
];
