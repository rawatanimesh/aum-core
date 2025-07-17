import { Route } from '@angular/router';
// import { KeycloakAuthGuardService } from './keycloak.service';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('@aum/aum-template').then((m) => m.AumTemplate), // Common layout
    // canActivate: [KeycloakAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@aum-modules/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'playground',
        loadComponent: () =>
          import('@aum-modules/playground').then((m) => m.Playground),
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
    ],
  },
];
