import type { Config } from './types'

export const NAME = '_seisei'

export const DEFAULT_CONFIG: Config = {
  base: './',
  overwrite: {
    directory: false,
    file: false,
  },
  variants: {},
}

export const EXAMPLE_VARIANTS: Config['variants'] = {
  funcName: 'hello',
  varName: 'greeting',
  returnValue: 'hello world',
  fileName: 'index',
}

export const DEFAULT_TEMPLATE_FILE_NAME = '{{fileName}}.ts'

export const DEFAULT_TEMPLATE_CONTENT = `function {{funcName}}() {
    return "{{returnValue}}"
}

const {{varName}} = {{funcName}}()

console.log({{varName}})
`
