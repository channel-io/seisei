import { defineConfig } from 'tsup'
import { esmConfig } from '../../tsup.config'

export default defineConfig([
  {
    ...esmConfig,
    name: '@seisei/cli - esm',
  },
])
