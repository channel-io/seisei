import type { Options } from 'tsup'

export const esmConfig: Options = {
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'node',
  dts: true,
  sourcemap: true,
}

export const cjsConfig: Options = {
  entry: ['./src/index.ts'],
  format: ['cjs'],
  platform: 'node',
  dts: true,
  sourcemap: true,
}
