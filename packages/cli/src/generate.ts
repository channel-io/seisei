import {
  type Config,
  generateCode,
  getTemplates,
  getVariantsFromTemplate,
  readConfigFile,
} from '@seisei/core'
import { confirmOverwrite } from './prompt/confirmOverwrite'
import { inputVariants } from './prompt/inputVariants'
import { selectDirectory } from './prompt/selectDirectory'
import { selectTemplate } from './prompt/selectTemplate'

export async function generate() {
  const config: Config = readConfigFile()

  const templates = getTemplates()
  const template = await selectTemplate(templates)

  const outputPath = await selectDirectory(config.base)

  const overwriteOptions = await confirmOverwrite(config.overwrite)

  const variants = getVariantsFromTemplate(template)

  let variantMap = {}
  if (variants.length === 0) {
    console.log('No variants found')
  } else {
    console.log('You have the following variants:', variants)
    variantMap = await inputVariants(variants, config.variants)
  }

  const files = generateCode({
    template,
    outputPath,
    variants: variantMap,
    options: overwriteOptions,
  })

  console.log(files)
}
