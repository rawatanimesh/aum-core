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
];
