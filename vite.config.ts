import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './generated/routeTree.gen.ts'
    }),
    react(),
    tailwindcss()
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    rolldownOptions: {
      output: { codeSplitting: { groups: [{ name: 'supabase', test: /@supabase/ }] } }
    }
  },
  staged: { '*': 'vp check --fix' },
  fmt: {
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    trailingComma: 'none',
    semi: false,
    arrowParens: 'avoid',
    endOfLine: 'lf',
    printWidth: 100,
    sortPackageJson: true,
    ignorePatterns: [
      '.agents/skills/**',
      '.next/**',
      'generated/**',
      'pnpm-lock.yaml',
      'dist/**',
      'coverage/**',
      'AGENTS.md'
    ],
    sortImports: {
      newlinesBetween: true,
      ignoreCase: true,
      internalPattern: ['@/**', '@generated/**'],
      customGroups: [
        {
          groupName: 'generated',
          elementNamePattern: ['@generated/**']
        }
      ],
      groups: [
        'type-import',
        ['value-builtin', 'value-external'],
        'generated',
        'value-internal',
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown'
      ]
    }
  },
  lint: {
    ignorePatterns: ['**/node_modules/**', 'generated/**', 'dist/**', 'coverage/**'],
    plugins: ['typescript', 'unicorn', 'oxc', 'react'],
    categories: {
      correctness: 'error'
    },
    rules: {
      'typescript/no-explicit-any': 'error',
      'no-template-curly-in-string': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'typescript/consistent-type-imports': 'warn',
      'typescript/consistent-type-exports': 'warn',
      'react/rules-of-hooks': 'error',
      'react/exhaustive-deps': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/prefer-function-component': 'error',
      'react/forward-ref-uses-ref': 'warn',
      'react/no-unknown-property': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/app/*/_components/**', '!./**'],
              message: 'Cross-feature import — move shared code to src/ instead'
            }
          ]
        }
      ],
      'vite-plus/prefer-vite-plus-imports': 'error'
    },
    env: {
      builtin: true
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin'
      }
    ],
    options: {
      typeAware: true,
      typeCheck: true
    }
  },
  test: { include: ['src/**/*.test.ts'] }
})
