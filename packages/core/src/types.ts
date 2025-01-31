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

export const CaseSuffixes = {
  CAMEL: 'cc',
  SNAKE: 'sc',
  PASCAL: 'pc',
  KEBAB: 'kc',
} as const

export type CaseSuffix = (typeof CaseSuffixes)[keyof typeof CaseSuffixes]

export const CaseStyles = {
  CAMEL: 'camelCase',
  SNAKE: 'snake_case',
  PASCAL: 'PascalCase',
  KEBAB: 'kebab-case',
} as const

export type CaseStyle = (typeof CaseStyles)[keyof typeof CaseStyles]

export interface VariantWithCase {
  value: string
  suffix?: CaseSuffix
}
