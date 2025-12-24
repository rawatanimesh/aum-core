import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '@aum/ui/utilities';
import { createHttpErrorLog, logStructuredError } from './error-logger.util';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Server-side error
        errorMessage = getHttpErrorMessage(error.status, error.error);
      }

      // Log detailed error in structured JSON format
      const errorLog = createHttpErrorLog(error);
      logStructuredError(errorLog);

      // Show user-friendly message in snackbar
      snackbarService.error(errorMessage, 4000);

      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};

function getHttpErrorMessage(status: number, errorBody: any): string {
  // Check if server provided a custom message
  const serverMessage = errorBody?.message || errorBody?.error;

  switch (status) {
    case 0:
      return 'Unable to connect to server. Please check your connection.';
    case 400:
      return serverMessage || 'Invalid request. Please check your input.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return (
        serverMessage ||
        'Conflict occurred. The resource may have been modified.'
      );
    case 422:
      return serverMessage || 'Validation failed. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    case 504:
      return 'Request timeout. Please try again.';
    default:
      return serverMessage || 'An error occurred. Please try again.';
  }
}
