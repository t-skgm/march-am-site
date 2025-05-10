import { defineConfig, globalIgnores } from 'eslint/config'
import love from 'eslint-config-love'
import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

const tspName = 'typescript-eslint/parser'

export default defineConfig([
  globalIgnores([
    'src/infra/contentful/generated.d.ts',
    '**/tailwind.config.cjs',
    '**/astro.config.mjs',
    '**/eslint.config.mjs'
  ]),
  ...tseslint.configs.recommended,
  {
    ...love,
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'space-before-function-paren': 'off',
      'import/no-absolute-path': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'multiline-ternary': 'off'
    }
  },
  // workaround from https://github.com/ota-meshi/eslint-plugin-astro/issues/447#issuecomment-2576486663
  ...eslintPluginAstro.configs.recommended.map((c) => {
    const opts = c.languageOptions
    const baseParser = opts?.parser?.meta?.name
    const subParser = opts?.parserOptions?.parser?.meta?.name
    if (opts && (baseParser === tspName || subParser === tspName)) {
      opts.parserOptions = {
        ...opts.parserOptions,
        projectService: false,
        project: true
      }
    }
    return c
  }),
  {
    files: ['./functions/**/*'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: ['./functions/tsconfig.json']
      }
    }
  }
])
