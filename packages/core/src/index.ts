import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  DEFAULT_CONFIG,
  DEFAULT_TEMPLATE_CONTENT,
  DEFAULT_TEMPLATE_FILE_NAME,
  EXAMPLE_VARIANTS,
  NAME,
} from './constants'
import type { Config, Template } from './types'
import {
  assert,
  type GenerateCodeWithReplacingArgs,
  findConfigDirectoryPath,
  generateCodeWithReplacing,
  getDirectoriesStats,
  isHidden,
  makeDirectory,
  readJson,
  searchVariants,
  writeFile,
} from './utils'

/**
 * Reads the configuration file
 * @param configDirectoryPath
 * @returns {Config} The configuration object
 * @throws {Error} If the configuration file is not found
 */

export function readConfigFile(configDirectoryPath?: string): Config {
  const _path = configDirectoryPath ?? findConfigDirectoryPath() ?? ''

  assert(fs.existsSync(_path), 'Could not find config directory')

  try {
    const configFilePath = path.join(_path, 'config.json')
    const configJson: Partial<Config> = readJson(configFilePath)

    return {
      ...DEFAULT_CONFIG,
      ...configJson,
      overwrite: {
        ...DEFAULT_CONFIG.overwrite,
        ...configJson.overwrite,
      },
    }
  } catch {
    throw new Error('Could not find config file')
  }
}

/**
 * Gets the list of templates
 * @param configFolderPath
 * @returns {Template[]} The list of templates
 * @throws {Error} If the config directory is not found
 */

export function getTemplates(configFolderPath?: string): Template[] {
  const _path = configFolderPath ?? findConfigDirectoryPath() ?? ''

  assert(fs.existsSync(_path), 'Could not find config directory')

  return getDirectoriesStats(_path).reduce((acc, stat) => {
    if (stat.isDirectory() && !isHidden(stat.name)) {
      acc.push({
        name: stat.name,
        path: stat.path,
      })
    }
    return acc
  }, [] as Template[])
}

/**
 * Gets the list of variants from the template
 * @param {Template} template - The template object
 *
 * @returns {string[]} The list of variants
 * @throws {Error} If the template directory is not found
 */
export function getVariantsFromTemplate(template: Template): string[]

/**
 * Gets the list of variants from the template
 * @param {string} template - The path to the template
 *
 * @returns {string[]} The list of variants
 * @throws {Error} If the template directory is not found
 */
export function getVariantsFromTemplate(template: string): string[]
export function getVariantsFromTemplate(template: Template | string): string[] {
  return searchVariants(typeof template === 'string' ? template : template.path)
}

interface GenerateCodeArgs
  extends Omit<GenerateCodeWithReplacingArgs, 'isRoot'> {}

/**
 * Generates code based on the provided arguments.
 *
 * @param {GenerateCodeArgs} args - The arguments required for code generation.
 * @param {string} args.template - The path to the template used for generating code.
 * @param {string} args.outputPath - The target path where the generated code will be saved.
 * @param {Record<string, string>} args.variants - A key-value mapping of variant names to their values for customizing the generated code.
 * @param {boolean} [args.options] - Optional overwrite behavior configuration from the `Config` type.
 */
export function generateCode(
  args: Omit<GenerateCodeArgs, 'templatePath'> & { template: Template },
): string[]
export function generateCode(
  args: Omit<GenerateCodeArgs, 'templatePath'> & { template: string },
): string[]
export function generateCode(
  args: Omit<GenerateCodeArgs, 'templatePath'> & {
    template: Template | string
  },
): string[] {
  return generateCodeWithReplacing({
    ...args,
    templatePath:
      typeof args.template === 'string' ? args.template : args.template.path,
  })
}

/**
 * Generates a configuration directory and a template file within it.
 *
 * @param {string} [outputPath] - The optional path where the configuration directory will be created.
 *                                If not provided, current path will be used.
 */
export function generateConfig(outputPath?: string) {
  const configDirectoryPath = makeDirectory({
    outputPath,
    name: NAME,
  })

  const exampleConfig = {
    ...DEFAULT_CONFIG,
    variants: EXAMPLE_VARIANTS,
  }

  writeFile({
    outputPath: configDirectoryPath,
    fileName: 'config.json',
    body: JSON.stringify(exampleConfig, null, 2),
  })

  const templatePath = makeDirectory({
    outputPath: configDirectoryPath,
    name: 'ExampleTemplate',
  })

  writeFile({
    outputPath: templatePath,
    fileName: DEFAULT_TEMPLATE_FILE_NAME,
    body: DEFAULT_TEMPLATE_CONTENT,
  })
}

export type { Config, Template }
export { NAME }
