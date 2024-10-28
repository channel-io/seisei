import type { Options } from 'tsup'

export const commonConfig: Options = {
  entry: ['./src/index.ts'],
  platform: 'node',
  clean: true,
  minify: true,
}

export const esmConfig: Options = {
  ...commonConfig,
  format: ['esm'],
}

export const cjsConfig: Options = {
  ...commonConfig,
  format: ['cjs'],
}
