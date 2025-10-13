import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@aum/utils/services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate: CanActivateFn = (route, state): boolean | UrlTree => {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    // Save last attempted route
    this.auth.setLastAttemptedRoute(state.url);

    return this.router.createUrlTree(['/login']);
  };
}
