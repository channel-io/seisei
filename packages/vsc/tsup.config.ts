import { defineConfig } from 'tsup'
import { cjsConfig, esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    name: '@seisei/vsc - esm',
    noExternal: [/^((?!(vscode)).)*$/],
    external: ['vscode'],
  },
  {
    ...cjsConfig,
    name: '@seisei/vsc - cjs',
    noExternal: [/^((?!(vscode)).)*$/],
    external: ['vscode'],
  },
])
