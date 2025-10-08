# Deployment Guide

This document outlines the deployment process, environment configuration, and CI/CD setup for the AUM UI project.

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Build Process](#build-process)
- [Deployment Strategies](#deployment-strategies)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Checklist](#production-checklist)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)

---

## 🌍 Environment Setup

### Environment Types

#### Development

```bash
# Local development
npm install
nx serve aum-core

# Environment variables
NODE_ENV=development
API_URL=http://localhost:3000
ENABLE_DEBUG=true
```

#### Staging

```bash
# Staging build
nx build aum-core --configuration=staging

# Environment variables
NODE_ENV=staging
API_URL=https://api-staging.aum-ui.com
ENABLE_DEBUG=true
ENABLE_ANALYTICS=false
```

#### Production

```bash
# Production build
nx build aum-core --configuration=production

# Environment variables
NODE_ENV=production
API_URL=https://api.aum-ui.com
ENABLE_DEBUG=false
ENABLE_ANALYTICS=true
```

### Environment Configuration Files

**`environments/environment.ts`** (Development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true,
  enableAnalytics: false,
  version: '0.1.0',
};
```

**`environments/environment.staging.ts`** (Staging)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-staging.aum-ui.com/api',
  enableDebug: true,
  enableAnalytics: false,
  version: '0.1.0',
};
```

**`environments/environment.production.ts`** (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.aum-ui.com/api',
  enableDebug: false,
  enableAnalytics: true,
  version: '0.1.0',
};
```

---

## 🏗️ Build Process

### Development Build

```bash
# Standard development build
nx build aum-core

# Development build with file watching
nx build aum-core --watch

# Development build with source maps
nx build aum-core --source-map
```

### Production Build

```bash
# Optimized production build
nx build aum-core --configuration=production

# Production build with bundle analysis
nx build aum-core --configuration=production --stats-json

# Analyze bundle size
npx webpack-bundle-analyzer dist/apps/aum-core/stats.json
```

### Build Optimization

#### Angular Build Configuration

```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true,
      "aot": true
    }
  }
}
```

#### Performance Optimizations

1. **Tree Shaking**

- Remove unused code automatically
- Use ES6 modules for better tree shaking

2. **Code Splitting**

- Lazy load feature modules
- Split vendor and application code

3. **Compression**

- Enable Gzip compression
- Use Brotli for better compression ratios

4. **Caching**

- Enable service worker caching
- Set proper cache headers

---

## 🚀 Deployment Strategies

### 1. Static Site Deployment

#### Netlify

```bash
# Build command
nx build aum-core --configuration=production

# Publish directory
dist/apps/aum-core

# Redirects (_redirects file)
/*    /index.html   200
```

#### Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "nx build aum-core --configuration=production"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '22.17.0'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: nx build aum-core --configuration=production --base-href=/aum-core/

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/apps/aum-core
```

### 2. Container Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN nx build aum-core --configuration=production

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/apps/aum-core /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  aum-ui:
    build: .
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. CDN Deployment

#### AWS CloudFront

1. Build application for production
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up SSL certificate
5. Configure custom domain

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: nx lint aum-core

      - name: Test
        run: nx test aum-core --coverage --watch=false

      - name: Build
        run: nx build aum-core --configuration=production

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for staging
        run: nx build aum-core --configuration=staging

      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          echo "Deploying to staging..."

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for production
        run: nx build aum-core --configuration=production

      - name: Deploy to production
        run: |
          # Deploy to production environment
          echo "Deploying to production..."
```

### Deployment Stages

1. **Code Quality Checks**

- ESLint validation
- TypeScript compilation
- Unit test execution
- Code coverage reporting

2. **Build Verification**

- Production build success
- Bundle size analysis
- Security scanning

3. **Staging Deployment**

- Deploy to staging environment
- Run integration tests
- Performance testing

4. **Production Deployment**

- Deploy to production
- Health checks
- Performance monitoring

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] CDN configuration tested

### Post-Deployment

- [ ] Application health check passed
- [ ] Core functionality verified
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Analytics tracking verified
- [ ] Backup systems operational

### Performance Metrics

| Metric                   | Target  | Critical |
| ------------------------ | ------- | -------- |
| First Contentful Paint   | < 1.5s  | < 3s     |
| Largest Contentful Paint | < 2.5s  | < 4s     |
| First Input Delay        | < 100ms | < 300ms  |
| Cumulative Layout Shift  | < 0.1   | < 0.25   |

---

## 📊 Monitoring

### Performance Monitoring

```typescript
// Performance tracking
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  trackPerformance(): void {
    // Core Web Vitals tracking
    if ('web-vital' in window) {
      // Implementation for performance tracking
    }
  }

  trackError(error: Error): void {
    // Error tracking implementation
  }
}
```

### Health Check Endpoint

```typescript
// Health check service
@Injectable({ providedIn: 'root' })
export class HealthCheckService {
  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health');
  }
}
```

### Monitoring Tools

- **Application Performance**: New Relic, DataDog
- **Error Tracking**: Sentry, Rollbar
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Analytics**: Google Analytics, Mixpanel

---

## 🔄 Rollback Procedures

### Automated Rollback

```bash
# Rollback to previous version
./scripts/rollback.sh --version=previous

# Rollback to specific version
./scripts/rollback.sh --version=1.2.3
```

### Manual Rollback Steps

1. **Identify Issue**

- Check monitoring dashboards
- Review error logs
- Confirm rollback necessity

2. **Prepare Rollback**

- Backup current state
- Prepare previous version
- Notify stakeholders

3. **Execute Rollback**

- Deploy previous version
- Verify functionality
- Update DNS if needed

4. **Post-Rollback**

- Monitor application health
- Investigate root cause
- Plan fix implementation

### Rollback Script Example

```bash
#!/bin/bash
# rollback.sh

VERSION=${1:-previous}

echo "Rolling back to version: $VERSION"

# Stop current application
pm2 stop aum-ui

# Switch to previous version
ln -sfn /app/releases/$VERSION /app/current

# Start application
pm2 start aum-ui

# Health check
curl -f http://localhost:3000/health || exit 1

echo "Rollback completed successfully"
```

---

## 🔐 Security Considerations

### HTTPS Configuration

```nginx
# nginx.conf
server {
   listen 443 ssl http2;
   ssl_certificate /path/to/cert.pem;
   ssl_certificate_key /path/to/key.pem;

   # Security headers
   add_header X-Frame-Options DENY;
   add_header X-Content-Type-Options nosniff;
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

### Content Security Policy

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
              script-src 'self' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';"
/>
```

---

This deployment guide will be updated as the project evolves and new deployment strategies are adopted.
