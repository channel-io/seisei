import { defineConfig } from 'tsup'
import { cjsConfig, esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    name: '@seisei/core - esm',
  },
  {
    ...cjsConfig,
    dts: true,
    name: '@seisei/core - cjs',
  },
])
