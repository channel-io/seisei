import { defineConfig } from 'tsup'
import { esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    dts: true,
    name: '@channel.io/seisei-core - esm',
  },
])
