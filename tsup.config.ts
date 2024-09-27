import type { Options } from 'tsup'

export const esmConfig: Options = {
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'node',
}

export const cjsConfig: Options = {
  entry: ['./src/index.ts'],
  format: ['cjs'],
  platform: 'node',
}
