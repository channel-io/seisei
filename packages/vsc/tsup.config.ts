import { defineConfig } from 'tsup'
import { cjsConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...cjsConfig,
    name: '@seisei/vsc - cjs',
    external: ['vscode'],
    noExternal: ['@channel.io/seisei-core'],
  },
])
