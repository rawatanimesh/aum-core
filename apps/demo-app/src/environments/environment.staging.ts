/**
 * Staging environment configuration
 */
export const environment = {
  production: false,

  // Single API URL
  apiUrl: 'https://api-staging.aum-ui.com/api',

  // OR multiple API URLs (uncomment if needed)
  // apiUrl: [
  //   'https://api-staging.aum-ui.com/api',
  //   'https://api2-staging.aum-ui.com/api'
  // ],

  enableDebug: true,
  enableAnalytics: false,
  version: '0.1.0',
};
