import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Configuration options for CSP initialization
 */
export interface CspConfig {
  /** API URLs to whitelist in connect-src */
  apiUrls: string | string[];
  /** Enable CSP violation reporting to console */
  enableViolationLogging?: boolean;
}

/**
 * Service to manage Content Security Policy dynamically
 * Updates CSP meta tag based on environment configuration
 *
 * Security Notes:
 * - Always uses strict mode (removes 'unsafe-inline' and 'unsafe-eval' from script-src)
 * - Provides XSS protection by blocking inline scripts and eval
 * - Style-src keeps 'unsafe-inline' for Angular component styles
 */
@Injectable({ providedIn: 'root' })
export class CspService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Initialize CSP with API URLs from environment
   * Should be called in APP_INITIALIZER
   * @param apiUrls - The API URLs to add to connect-src directive (can be single URL or array)
   * @param config - Optional configuration for CSP behavior
   */
  initializeCsp(apiUrls: string | string[], config?: Omit<CspConfig, 'apiUrls'>): void;
  initializeCsp(config: CspConfig): void;
  initializeCsp(apiUrlsOrConfig: string | string[] | CspConfig, config?: Omit<CspConfig, 'apiUrls'>): void {
    if (!this.isBrowser) {
      return; // Skip CSP updates during SSR
    }

    // Handle both signatures
    let finalConfig: CspConfig;
    if (typeof apiUrlsOrConfig === 'object' && 'apiUrls' in apiUrlsOrConfig) {
      finalConfig = apiUrlsOrConfig;
    } else {
      finalConfig = {
        apiUrls: apiUrlsOrConfig,
        ...config,
      };
    }

    const urls = Array.isArray(finalConfig.apiUrls) ? finalConfig.apiUrls : [finalConfig.apiUrls];
    const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

    if (!cspMetaTag) {
      console.warn('[CSP] Meta tag not found. Creating a new one.');
      this.createCspMetaTag(urls);
      return;
    }

    // Update existing CSP with API URLs
    let currentContent = cspMetaTag.getAttribute('content') || '';

    // Always apply strict mode for consistent security
    currentContent = this.applyStrictMode(currentContent);

    for (const url of urls) {
      currentContent = this.updateConnectSrc(currentContent, url);
    }
    cspMetaTag.setAttribute('content', currentContent);

    // Enable violation logging if requested
    if (finalConfig.enableViolationLogging) {
      this.enableViolationLogging();
    }

    console.log('[CSP] Initialized successfully', {
      apiUrls: urls,
      strict: true
    });
  }

  /**
   * Create a new CSP meta tag with the given API URLs
   */
  private createCspMetaTag(apiUrls: string[]): void {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', this.getDefaultCsp(apiUrls));
    document.head.appendChild(meta);
  }

  /**
   * Apply strict CSP mode by removing unsafe directives
   * Removes 'unsafe-inline' and 'unsafe-eval' from script-src
   */
  private applyStrictMode(cspContent: string): string {
    // Remove 'unsafe-inline' and 'unsafe-eval' from script-src
    cspContent = cspContent.replace(/script-src\s+([^;]+);?/, (_match, sources) => {
      const cleanedSources = sources
        .split(/\s+/)
        .filter((s: string) => s.trim() && s !== "'unsafe-inline'" && s !== "'unsafe-eval'")
        .join(' ');
      return `script-src ${cleanedSources};`;
    });

    // Remove 'unsafe-inline' from style-src (optional - may break Angular component styles)
    // Uncomment if you want strict styles as well:
    // cspContent = cspContent.replace(/style-src\s+([^;]+);?/, (match, sources) => {
    //   const cleanedSources = sources
    //     .split(/\s+/)
    //     .filter((s: string) => s.trim() && s !== "'unsafe-inline'")
    //     .join(' ');
    //   return `style-src ${cleanedSources};`;
    // });

    return cspContent;
  }

  /**
   * Enable CSP violation logging to console
   * Helps debug CSP issues during development
   */
  private enableViolationLogging(): void {
    if (!this.isBrowser) {
      return;
    }

    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('[CSP Violation]', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
      });
    });
  }

  /**
   * Update the connect-src directive in CSP content
   */
  private updateConnectSrc(currentContent: string, apiUrl: string): string {
    // Find connect-src directive
    const connectSrcRegex = /connect-src\s+([^;]+);?/;
    const match = currentContent.match(connectSrcRegex);

    if (match) {
      // Update existing connect-src
      const currentConnectSrc = match[1];
      const sources = currentConnectSrc.split(/\s+/).filter(s => s.trim());

      // Add API URL if not already present
      if (!sources.includes(apiUrl)) {
        sources.push(apiUrl);
      }

      const newConnectSrc = `connect-src ${sources.join(' ')}`;
      return currentContent.replace(connectSrcRegex, newConnectSrc + ';');
    } else {
      // Add connect-src if not present
      return currentContent.trim() + ` connect-src 'self' ${apiUrl};`;
    }
  }

  /**
   * Get default CSP configuration with API URLs
   * Always uses strict mode (no unsafe-inline or unsafe-eval in script-src)
   */
  private getDefaultCsp(apiUrls: string[]): string {
    const urls = apiUrls.join(' ');

    // Always use strict mode for security
    return `default-src 'self'; ` +
           `script-src 'self'; ` +
           `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
           `font-src 'self' https://fonts.gstatic.com; ` +
           `img-src 'self' data:; ` +
           `connect-src 'self' ${urls};`;
  }

  /**
   * Add additional allowed origins to connect-src at runtime
   * Useful for OAuth redirects or third-party integrations
   */
  addAllowedOrigin(origin: string): void {
    if (!this.isBrowser) {
      return;
    }

    const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

    if (!cspMetaTag) {
      console.warn('CSP meta tag not found. Cannot add allowed origin.');
      return;
    }

    const currentContent = cspMetaTag.getAttribute('content') || '';
    const updatedContent = this.updateConnectSrc(currentContent, origin);
    cspMetaTag.setAttribute('content', updatedContent);
  }
}
