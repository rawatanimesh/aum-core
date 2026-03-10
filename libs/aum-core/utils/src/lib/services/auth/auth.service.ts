import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly hardcodedEmail = 'animesh@mail.com';
  private readonly hardcodedPassword = '010101';

  isAuthenticated = signal(this.hasToken());

  private hasToken(): boolean {
    return localStorage.getItem('authToken') === 'true';
  }

  login(email: string | undefined, password: string | undefined): boolean {
    if (email === this.hardcodedEmail && password === this.hardcodedPassword) {
      localStorage.setItem('authToken', 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticated.set(false);
    this.clearLastAttemptedRoute();
  }

  setLastAttemptedRoute(route: string) {
    localStorage.setItem('lastRoute', route);
  }

  getLastAttemptedRoute(): string | null {
    return localStorage.getItem('lastRoute');
  }

  clearLastAttemptedRoute() {
    localStorage.removeItem('lastRoute');
  }
}
