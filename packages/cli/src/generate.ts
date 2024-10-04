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
  let config: Config
  try {
    config = readConfigFile()
  } catch (e) {
    console.error(e instanceof Error ? e.message : 'Failed to read config file')
    return
  }

  try {
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

    generateCode({
      template,
      outputPath,
      variants: variantMap,
      options: overwriteOptions,
    })

    console.log('Successfully generated code')
  } catch (e) {
    console.error(e instanceof Error ? e.message : 'Failed to generate code')
  }
}
