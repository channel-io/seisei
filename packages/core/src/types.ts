import type { Stats } from 'node:fs'

interface BaseStats {
  name: string
  path: string
}

export interface Template extends BaseStats {}

export interface DirectoryStats extends Stats, BaseStats {}

export interface Config {
  base: string
  overwrite: {
    directory: boolean
    file: boolean
  }
  variants: Record<string, string>
}
