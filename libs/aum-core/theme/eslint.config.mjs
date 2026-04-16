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
          paths: [
            {
              name: '@aum/theme',
              message:
                'Inside libs/aum-core/theme, import siblings via relative paths — not the @aum/theme alias. Self-barrel imports cause circular dependencies.',
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
