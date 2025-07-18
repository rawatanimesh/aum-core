# Angular UI Mods - AUM

## https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial

## Node version -

v22.17.0

## Serve

```sh
npx nx run agentic-ai-app
or
nx run agentic-ai-app:serve:development
```

## Build

```sh
nx run agentic-ai-app:build:production
nx run agentic-ai-app:build:development
```

## Generate Theme

```sh
npx nx g @angular/material:theme-color --project=aum-core
```

primary: #FF008C, secondary: #ffffff, tertiary: #ffffff, neutral: #ffffff, neutral variant: #ffffff, error: #DF0101

Refer link - https://material-foundation.github.io/material-theme-builder/

## System varialbles (for themeing)

https://material.angular.dev/guide/system-variables

## Important points to note

- libs/aum is only for generic/common utilities and components (prefix aum)

- App related code to be written inside libs/modules (prefix aum-modules)

- Put aum library related assets like svgs, icons, fonts inside libs/aum/theme/src/assets folder

- Use of stanalone components (no module files)

- Use of signals and inject

- Use latest angular code schema (@for @if etc)

- Use of material system variables

- Use of rem() function to give styling

- Use of helper css classes (utilities.scss)

- Use button with class unstyled-button for custom click events

- Test your changes in dark mode too
