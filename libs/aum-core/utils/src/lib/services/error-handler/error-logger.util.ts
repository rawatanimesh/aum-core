import { HttpErrorResponse } from '@angular/common/http';

/**
 * Structured error log format for consistent error tracking
 * This format can be sent to external logging services
 */
export interface StructuredErrorLog {
  /** Timestamp when error occurred */
  timestamp: string;

  /** Type of error: 'HTTP', 'JavaScript', 'Angular', etc. */
  errorType: string;

  /** Error message */
  message: string;

  /** HTTP status code (only for HTTP errors) */
  statusCode?: number;

  /** Current route/URL where error occurred */
  route: string;

  /** Browser information */
  browser: {
    userAgent: string;
    platform: string;
    language: string;
  };

  /** Error stack trace (if available) */
  stack?: string;

  /** Additional error details */
  details?: {
    url?: string;
    method?: string;
    responseBody?: any;
    errorName?: string;
    [key: string]: any;
  };

  /** Application environment info */
  environment?: {
    appVersion?: string;
    buildNumber?: string;
  };
}

/**
 * Logs structured error to console in JSON format
 * Can be extended to send to external logging service
 */
export function logStructuredError(errorLog: StructuredErrorLog): void {
  // Create single console.error with essential info
  const errorIcon = errorLog.errorType.includes('HTTP') ? '🌐' : '⚠️';
  const statusInfo = errorLog.statusCode ? ` [${errorLog.statusCode}]` : '';

  console.error(
    `%c${errorIcon} ${errorLog.errorType}${statusInfo}%c @ ${errorLog.route}`,
    'color: #d32f2f; font-weight: bold; font-size: 13px;',
    'color: #666; font-weight: normal; font-size: 12px;',
    '\n',
    errorLog
  );

  // TODO: Send to external logging service
  // Example: sendToLoggingService(errorLog);
}

/**
 * Creates structured error log for HTTP errors
 */
export function createHttpErrorLog(error: HttpErrorResponse): StructuredErrorLog {
  return {
    timestamp: new Date().toISOString(),
    errorType: 'HTTP',
    message: error.message,
    statusCode: error.status,
    route: window.location.pathname,
    browser: getBrowserInfo(),
    stack: error.error?.stack,
    details: {
      url: error.url || undefined,
      method: error.url ? 'Unknown' : undefined, // Method not available in HttpErrorResponse
      responseBody: error.error,
      statusText: error.statusText,
      headers: extractHeaders(error.headers),
    },
  };
}

/**
 * Creates structured error log for JavaScript/Angular errors
 */
export function createJavaScriptErrorLog(error: Error): StructuredErrorLog {
  return {
    timestamp: new Date().toISOString(),
    errorType: getErrorType(error),
    message: error.message || error.toString(),
    route: window.location.pathname,
    browser: getBrowserInfo(),
    stack: error.stack,
    details: {
      errorName: error.name,
      errorString: error.toString(),
    },
  };
}

/**
 * Get browser information
 */
function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };
}

/**
 * Determine specific error type from Error object
 */
function getErrorType(error: Error): string {
  const errorName = error.name || '';

  // Common JavaScript error types
  if (errorName.includes('TypeError')) return 'JavaScript - TypeError';
  if (errorName.includes('ReferenceError')) return 'JavaScript - ReferenceError';
  if (errorName.includes('SyntaxError')) return 'JavaScript - SyntaxError';
  if (errorName.includes('RangeError')) return 'JavaScript - RangeError';

  // Angular specific errors
  if (error.message?.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
    return 'Angular - Change Detection';
  }
  if (error.message?.includes('NullInjectorError')) {
    return 'Angular - Dependency Injection';
  }

  return 'JavaScript - ' + (errorName || 'Unknown');
}

/**
 * Extract relevant headers from HttpHeaders object
 */
function extractHeaders(headers: any): Record<string, string> | undefined {
  if (!headers) return undefined;

  const headerObj: Record<string, string> = {};
  const relevantHeaders = ['content-type', 'authorization', 'x-request-id'];

  relevantHeaders.forEach(header => {
    const value = headers.get?.(header);
    if (value) {
      headerObj[header] = value;
    }
  });

  return Object.keys(headerObj).length > 0 ? headerObj : undefined;
}
