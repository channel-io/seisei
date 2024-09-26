import { defineConfig } from 'tsup'
import { cjsConfig, esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    name: '@seisei/cli - esm',
  },
  {
    ...cjsConfig,
    name: '@seisei/cli - cjs',
    noExternal: [/^((?!(@inquirer\/core|@inquirer\/type)).)*$/],
    external: ['@inquirer/core', '@inquirer/type'],
  },
])
