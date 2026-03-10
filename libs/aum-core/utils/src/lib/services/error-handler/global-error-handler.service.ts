import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '@aum/ui/utilities';
import { createHttpErrorLog, createJavaScriptErrorLog, logStructuredError } from './error-logger.util';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackbarService = inject(SnackbarService);

  handleError(error: Error | HttpErrorResponse): void {
    // Skip HTTP errors - they're already handled by the HTTP interceptor
    if (error instanceof HttpErrorResponse) {
      // Log in structured format (interceptor already showed snackbar)
      const errorLog = createHttpErrorLog(error);
      logStructuredError(errorLog);
      return;
    }

    // Handle non-HTTP errors (JavaScript errors, Angular errors, etc.)
    const displayMessage = 'An error occurred. Please try again.';

    // Log detailed error in structured JSON format
    const errorLog = createJavaScriptErrorLog(error);
    logStructuredError(errorLog);

    // Show user-friendly message in snackbar
    this.snackbarService.error(displayMessage, 4000);
  }
}
