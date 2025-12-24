import { Route } from '@angular/router';
import { AuthGuardService } from './auth-gaurd.service';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@aum/general-templates').then((m) => m.LoginComponent),
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('@aum/aum-template').then((m) => m.AumTemplate), // Common layout
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@aum-modules/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'playground',
        loadChildren: () =>
          import('@aum-modules/playground').then((m) => m.playgroundRoutes),
      },
      // // Launch agent from dashboard (shortcut route)
      // {
      //   path: 'email-agent',
      //   loadComponent: () =>
      //     import('@aum/email-agent').then((m) => m.EmailAgentComponent),
      //   data: {
      //     source: 'dashboard',
      //   },
      // },
      // Launch from agent from agent listing
      // {
      //   path: 'agents',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () =>
      //         import('./agent/agent-list.component').then(
      //           (m) => m.AgentListComponent
      //         ),
      //     },
      //     {
      //       path: ':agent',
      //       loadComponent: () =>
      //         import('./agent/agent-launch.component').then(
      //           (m) => m.AgentLaunchComponent
      //         ),
      //       data: {
      //         source: 'agent-directory',
      //       },
      //     },
      //   ],
      // },
      //more child routes here
      {
        path: '**',
        loadComponent: () =>
          import('@aum/general-templates').then((m) => m.PageNotFoundComponent),
      },
    ],
  },
];
