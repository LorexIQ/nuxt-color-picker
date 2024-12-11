// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true
  },
  dirs: {
    src: [
      './playground'
    ]
  }
})
  .append(
    {
      rules: {
        'no-new-func': 'off',
        'no-eval': 'off',
        'vue/multi-word-component-names': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-dynamic-delete': 'off',
        'antfu/if-newline': 'off',
        'no-async-promise-executor': 'off',
        'no-console': 'off',
        'node/prefer-global/process': 'off',
        'unicorn/prefer-number-properties': 'off',
        'no-extra-boolean-cast': 'off',
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/comma-dangle': ['error', 'never'],
        '@stylistic/lines-between-class-members': 'off',
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/template-curly-spacing': ['error', 'never'],
        '@stylistic/brace-style': ['error', '1tbs'],
        '@stylistic/object-curly-spacing': ['error', 'always', {
          arraysInObjects: true,
          objectsInObjects: true
        }],
        '@stylistic/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'semi',
                requireLast: true
              }
            }
          }
        }]
      }
    }
  );
