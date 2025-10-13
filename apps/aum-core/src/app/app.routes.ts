import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthGuardService } from './auth-gaurd.service';
import { AuthService } from '@aum/utils/services';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('@aum/general-templates').then((m) => m.LoginComponent),
    // login to avoid flashing of login page before auth state is checked and then routed
    canActivate: [
      () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        if (auth.isAuthenticated()) {
          const redirectUrl = auth.getLastAttemptedRoute() ?? '/dashboard';
          router.navigateByUrl(redirectUrl);
          return false; // block login page
        }
        return true; // allow
      },
    ],
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
    ],
  },
];
