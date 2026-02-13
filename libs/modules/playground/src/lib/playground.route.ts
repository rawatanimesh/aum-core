import { Routes } from '@angular/router';

export const playgroundRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./playground/playground').then((m) => m.Playground),
  },

  {
    path: 'inputs',
    loadComponent: () =>
      import('./input-demo/input-demo').then((m) => m.InputDemo),
  },

  {
    path: 'error-test',
    loadComponent: () =>
      import('./error-test/error-test.component').then((m) => m.ErrorTestComponent),
  },

  {
    path: 'charts',
    loadComponent: () =>
      import('./charts-demo/charts-demo').then((m) => m.ChartsDemo),
  },

  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs-demo/tabs-demo').then((m) => m.TabsDemo),
  },

  {
    path: 'expansion-panels',
    loadComponent: () =>
      import('./expansion-panel-demo/expansion-panel-demo').then((m) => m.ExpansionPanelDemo),
  },

  {
    path: 'slide-toggle',
    loadComponent: () =>
      import('./slide-toggle-demo/slide-toggle-demo').then((m) => m.SlideToggleDemo),
  },
];
