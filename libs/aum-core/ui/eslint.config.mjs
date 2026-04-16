import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      // Prevent self-barrel imports: files inside this lib must use relative paths,
      // not the lib's own public @aum/ui/* aliases. Self-imports create circular
      // ES module dependencies that cause NG0919 runtime crashes in lazy routes.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@aum/ui/*'],
              message:
                'Inside libs/aum-core/ui, import siblings via relative paths (e.g. ../../utilities/icon/icon) — not @aum/ui/* aliases. Self-barrel imports cause circular dependencies and NG0919 in lazy-loaded routes.',
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
