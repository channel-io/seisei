import { defineConfig } from 'tsup'
import { cjsConfig, esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    name: '@channel.io/seisei-core - esm',
    dts: true,
  },
  {
    ...cjsConfig,
    name: '@channel.io/seisei-core - cjs',
  },
])
