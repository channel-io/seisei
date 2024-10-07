import type { Options } from 'tsup'

export const esmConfig: Options = {
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'node',
  treeshake: true,
}
