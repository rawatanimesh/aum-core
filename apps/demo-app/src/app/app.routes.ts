import { Route } from '@angular/router';
import { AuthGuardService } from './auth-gaurd.service';
import { TemplateWrapperComponent } from './template-wrapper.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@aum/common').then((m) => m.LoginComponent),
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TemplateWrapperComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@demo/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'playground',
        loadChildren: () =>
          import('@demo/playground').then((m) => m.playgroundRoutes),
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
          import('@aum/common').then((m) => m.PageNotFoundComponent),
      },
    ],
  },
];
