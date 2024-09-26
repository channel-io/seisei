import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'seisei-core-esm',
    entry: ['src/index.ts'],
    format: ['esm'],
    platform: 'node',
    dts: true,
    sourcemap: true,
  },
  {
    name: 'seisei-core-cjs',
    entry: ['src/index.ts'],
    format: ['cjs'],
    platform: 'node',
    noExternal: [/^((?!(@inquirer\/core|@inquirer\/type)).)*$/],
    external: ['@inquirer/core', '@inquirer/type'],
    dts: true,
    sourcemap: true,
  },
])
