import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@aum/ui/buttons';
import { PageComponent } from '@aum/ui/layout';

@Component({
  selector: 'playground-error-test',
  imports: [CommonModule, ButtonComponent, PageComponent],
  templateUrl: './error-test.component.html',
  styleUrl: './error-test.component.scss',
})
export class ErrorTestComponent {
  private http = inject(HttpClient);

  // Test 1: Global Error Handler - JavaScript Error
  triggerJavaScriptError() {
    console.log('🧪 Test 1: Triggering JavaScript Error...');
    // This will be caught by GlobalErrorHandler
    throw new Error('This is a test JavaScript error from ErrorTestComponent');
  }

  // Test 2: Global Error Handler - Undefined Property Access
  triggerUndefinedError() {
    console.log('🧪 Test 2: Triggering Undefined Property Error...');
    // This will be caught by GlobalErrorHandler
    const obj: any = null;
    console.log(obj.nonExistentProperty); // Will throw TypeError
  }

  // Test 3: HTTP Interceptor - 404 Not Found
  trigger404Error() {
    console.log('🧪 Test 3: Triggering 404 HTTP Error...');
    this.http
      .get('https://jsonplaceholder.typicode.com/posts/99999999')
      .subscribe({
        next: (data) => console.log('Success (unexpected):', data),
        error: (error) =>
          console.log('Error caught in component (expected):', error),
      });
  }

  // Test 4: HTTP Interceptor - 401 Unauthorized
  trigger401Error() {
    console.log('🧪 Test 4: Triggering 401 HTTP Error...');
    this.http
      .get('https://httpstat.us/401', {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (data) => console.log('Success (unexpected):', data),
        error: (error) =>
          console.log('Error caught in component (expected):', error),
      });
  }

  // Test 5: HTTP Interceptor - 500 Internal Server Error
  trigger500Error() {
    console.log('🧪 Test 5: Triggering 500 HTTP Error...');
    this.http
      .get('https://httpstat.us/500', {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (data) => console.log('Success (unexpected):', data),
        error: (error) =>
          console.log('Error caught in component (expected):', error),
      });
  }

  // Test 6: HTTP Interceptor - Network Error (Invalid URL)
  triggerNetworkError() {
    console.log('🧪 Test 6: Triggering Network Error...');
    this.http.get('https://invalid-domain-that-does-not-exist-12345.com/api').subscribe({
      next: (data) => console.log('Success (unexpected):', data),
      error: (error) =>
        console.log('Error caught in component (expected):', error),
    });
  }

  // Test 7: HTTP Interceptor - 403 Forbidden
  trigger403Error() {
    console.log('🧪 Test 7: Triggering 403 HTTP Error...');
    this.http
      .get('https://httpstat.us/403', {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (data) => console.log('Success (unexpected):', data),
        error: (error) =>
          console.log('Error caught in component (expected):', error),
      });
  }

  // Test 8: HTTP Interceptor - 400 Bad Request
  trigger400Error() {
    console.log('🧪 Test 8: Triggering 400 HTTP Error...');
    this.http
      .get('https://httpstat.us/400', {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (data) => console.log('Success (unexpected):', data),
        error: (error) =>
          console.log('Error caught in component (expected):', error),
      });
  }

  // Test 9: Successful HTTP Request (for comparison)
  triggerSuccessRequest() {
    console.log('🧪 Test 9: Triggering Successful HTTP Request...');
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: (data) => console.log('✅ Success:', data),
      error: (error) =>
        console.log('Error (unexpected):', error),
    });
  }
}
