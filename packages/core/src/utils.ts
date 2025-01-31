import * as fs from 'node:fs'
import * as path from 'node:path'
import { CONFIG_DIRECTORY_NAME, DEFAULT_CONFIG } from './constants'
import {
  CaseSuffixes,
  type CaseSuffix,
  type Config,
  type DirectoryStats,
  type VariantWithCase,
} from './types'

const VARIANT_PATTERN = (() => {
  const suffixPattern = Object.values(CaseSuffixes).join('|')
  return `{{(.+?)}(${suffixPattern})?}`
})()

const VARIANT_REGEX = new RegExp(VARIANT_PATTERN, 'g')
const SINGLE_VARIANT_REGEX = new RegExp(`^${VARIANT_PATTERN}$`)

export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function findConfigDirectoryPath(from?: string): string | null {
  let currentDir = from ?? process.cwd()

  while (currentDir !== path.parse(currentDir).root) {
    const _path = path.join(currentDir, CONFIG_DIRECTORY_NAME)

    if (fs.existsSync(_path)) {
      return _path
    }

    currentDir = path.dirname(currentDir)
  }

  return null
}

export function getDirectoriesStats(directoryPath: string): DirectoryStats[] {
  const isExist = fs.existsSync(directoryPath)
  if (!isExist) {
    throw new Error(`Could not find ${directoryPath}`)
  }

  return fs.readdirSync(directoryPath).map((fileName) => {
    const filePath = path.join(directoryPath, fileName)
    const stat = fs.statSync(filePath)
    return Object.assign(stat, { name: fileName, path: filePath })
  })
}

export function isHidden(targetPath: string) {
  const baseName = path.basename(targetPath)
  return /(^|\/)\.[^/.]/g.test(baseName)
}

export function readJson(jsonPath: string) {
  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    return JSON.parse(jsonContent)
  } catch {
    throw new Error(`Could not read ${jsonPath}`)
  }
}

function extractVariants(content: string): string[] {
  const matches: string[] = []
  let match: RegExpExecArray | null = null

  while ((match = VARIANT_REGEX.exec(content)) !== null) {
    const variant = parseVariantWithCase(match[0])
    matches.push(variant.value)
  }

  return matches
}

function extractVariantsFromFileContent(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return extractVariants(fileContent)
}

export function searchVariants(templatePath: string): string[] {
  const stats = fs.statSync(templatePath)
  const baseName = path.basename(templatePath)

  let variants: string[] = []

  const extractedNamesFromName = extractVariants(baseName)
  if (extractedNamesFromName.length > 0) {
    variants = variants.concat(extractedNamesFromName)
  }

  if (stats.isDirectory()) {
    const children = fs.readdirSync(templatePath)

    children.forEach((child) => {
      const childPath = path.join(templatePath, child)
      const childVariants = searchVariants(childPath)
      variants = variants.concat(childVariants)
    })
  }

  if (stats.isFile()) {
    const extractedNamesFromContent =
      extractVariantsFromFileContent(templatePath)
    if (extractedNamesFromContent.length > 0) {
      variants = variants.concat(extractedNamesFromContent)
    }
  }

  return [...new Set(variants)]
}

export function replaceVariants(str: string, variants: Record<string, string>) {
  return str.replace(VARIANT_REGEX, (fullMatch) => {
    const { value, suffix } = parseVariantWithCase(fullMatch)
    const variantValue = variants[value]

    if (variantValue === undefined) return value

    if (suffix && suffix in caseStyleMap) {
      return caseStyleMap[suffix](variantValue)
    }

    return variantValue
  })
}

export interface GenerateCodeWithReplacingArgs {
  templatePath: string
  outputPath: string
  variants: Record<string, string>
  options?: Partial<Config['overwrite']>
  isRoot?: boolean
}

export function generateCodeWithReplacing({
  templatePath,
  outputPath,
  variants,
  options,
  isRoot = true,
}: GenerateCodeWithReplacingArgs): string[] {
  const result: string[] = []
  const stats = fs.statSync(templatePath)

  const _options = {
    directory: options?.directory ?? DEFAULT_CONFIG.overwrite.directory,
    file: options?.file ?? DEFAULT_CONFIG.overwrite.file,
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  if (stats.isDirectory()) {
    if (!isRoot) {
      const folderName = replaceVariants(path.basename(templatePath), variants)
      const _outputPath = path.join(outputPath, folderName)

      if (fs.existsSync(_outputPath)) {
        if (_options.directory) {
          fs.rmSync(_outputPath, { recursive: true })
          fs.mkdirSync(_outputPath)
        }
      } else {
        fs.mkdirSync(_outputPath)
      }

      outputPath = _outputPath
    }

    const children = fs.readdirSync(templatePath)
    children.forEach((child) => {
      const childBasePath = path.join(templatePath, child)
      result.push(
        ...generateCodeWithReplacing({
          templatePath: childBasePath,
          outputPath: outputPath,
          variants,
          options: _options,
          isRoot: false,
        }),
      )
    })
  } else if (stats.isFile()) {
    const fileName = replaceVariants(path.basename(templatePath), variants)
    const targetFilePath = path.join(outputPath, fileName)

    if (fs.existsSync(targetFilePath)) {
      if (_options.file) {
        const fileContent = fs.readFileSync(templatePath, 'utf-8')
        const replacedContent = replaceVariants(fileContent, variants)
        fs.writeFileSync(targetFilePath, replacedContent, 'utf-8')
        result.push(targetFilePath)
      }
    } else {
      const fileContent = fs.readFileSync(templatePath, 'utf-8')
      const replacedContent = replaceVariants(fileContent, variants)
      fs.writeFileSync(targetFilePath, replacedContent, 'utf-8')
      result.push(targetFilePath)
    }
  }

  return result
}

export function makeDirectory({
  outputPath = process.cwd(),
  name,
}: {
  outputPath?: string
  name: string
}) {
  const newDirPath = path.join(outputPath, name)

  assert(!fs.existsSync(newDirPath), 'Directory already exists')

  fs.mkdirSync(newDirPath)

  return newDirPath
}

export function writeFile({
  outputPath,
  fileName,
  body,
}: {
  outputPath: string
  fileName: string
  body: string
}) {
  const filePath = path.join(outputPath, fileName)

  assert(!fs.existsSync(filePath), 'File already exists')

  fs.writeFileSync(filePath, body, 'utf-8')
}

// 케이스 스타일 변환 유틸리티
const caseStyleUtils = {
  toCamelCase: (str: string): string => {
    return str
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toLowerCase())
  },

  toSnakeCase: (str: string): string => {
    return str
      .replace(/[-]|(?=[A-Z])/g, '_')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/_+/g, '_')
  },

  toPascalCase: (str: string): string => {
    return str
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toUpperCase())
  },

  toKebabCase: (str: string): string => {
    return str
      .replace(/[_]|(?=[A-Z])/g, '-')
      .toLowerCase()
      .replace(/^-/, '')
      .replace(/-+/g, '-')
  },
}

export const caseStyleMap: Record<CaseSuffix, (str: string) => string> = {
  [CaseSuffixes.CAMEL]: caseStyleUtils.toCamelCase,
  [CaseSuffixes.SNAKE]: caseStyleUtils.toSnakeCase,
  [CaseSuffixes.PASCAL]: caseStyleUtils.toPascalCase,
  [CaseSuffixes.KEBAB]: caseStyleUtils.toKebabCase,
}

export function parseVariantWithCase(variant: string): VariantWithCase {
  const match = variant.match(SINGLE_VARIANT_REGEX)
  if (!match) return { value: variant }

  return {
    value: match[1],
    suffix: match[2] as CaseSuffix | undefined,
  }
}
