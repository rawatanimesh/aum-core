import { Routes } from '@angular/router';

export const playgroundRoutes: Routes = [
  {
    path: '',
    title: 'Playground | Aum Core',
    loadComponent: () =>
      import('./playground/playground').then((m) => m.Playground),
  },

  {
    path: 'inputs',
    title: 'Inputs | Aum Core',
    loadComponent: () =>
      import('./input-demo/input-demo').then((m) => m.InputDemo),
  },

  {
    path: 'error-test',
    title: 'Error Test | Aum Core',
    loadComponent: () =>
      import('./error-test/error-test.component').then((m) => m.ErrorTestComponent),
  },

  {
    path: 'charts',
    title: 'Charts | Aum Core',
    loadComponent: () =>
      import('./charts-demo/charts-demo').then((m) => m.ChartsDemo),
  },

  {
    path: 'tabs',
    title: 'Tabs | Aum Core',
    loadComponent: () =>
      import('./tabs-demo/tabs-demo').then((m) => m.TabsDemo),
  },

  {
    path: 'expansion-panels',
    title: 'Expansion Panels | Aum Core',
    loadComponent: () =>
      import('./expansion-panel-demo/expansion-panel-demo').then((m) => m.ExpansionPanelDemo),
  },

  {
    path: 'slide-toggle',
    title: 'Slide Toggle | Aum Core',
    loadComponent: () =>
      import('./slide-toggle-demo/slide-toggle-demo').then((m) => m.SlideToggleDemo),
  },

  {
    path: 'carousels',
    title: 'Carousels | Aum Core',
    loadComponent: () =>
      import('./carousel-demo/carousel-demo').then((m) => m.CarouselDemo),
  },

  {
    path: 'upload-box',
    title: 'Upload Box | Aum Core',
    loadComponent: () =>
      import('./upload-box-demo/upload-box-demo').then((m) => m.UploadBoxDemo),
  },

  {
    path: 'button-toggle',
    title: 'Button Toggle | Aum Core',
    loadComponent: () =>
      import('./button-toggle-demo/button-toggle-demo').then((m) => m.ButtonToggleDemo),
  },

  {
    path: 'icons',
    title: 'Icons | Aum Core',
    loadComponent: () =>
      import('./icon-demo/icon-demo').then((m) => m.IconDemo),
  },
];
