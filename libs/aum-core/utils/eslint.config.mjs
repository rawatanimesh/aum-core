import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      // Prevent self-barrel imports within this lib — use relative paths instead.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@aum/utils/*'],
              message:
                'Inside libs/aum-core/utils, import siblings via relative paths — not @aum/utils/* aliases. Self-barrel imports cause circular dependencies.',
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'aum',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'aum',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
