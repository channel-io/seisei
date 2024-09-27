import * as path from 'node:path'
import {
  type Config,
  NAME,
  type Template,
  generateCode,
  getTemplates,
  getVariantsFromTemplate,
  readConfigFile,
} from 'seisei-core'
import * as vscode from 'vscode'
import { confirmOverwrite } from './prompt/confirmOverwrite'
import { inputOutputPath } from './prompt/inputOutputPath'
import { inputVariants } from './prompt/inputVariants'
import { selectTemplate } from './prompt/selectTemplate'

export async function execute(props?: { fsPath?: string }) {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length < 1
  ) {
    vscode.window.showErrorMessage('please open a workspace first')
    return null
  }

  let config: Config
  let outputPath = props?.fsPath

  try {
    config = readConfigFile(outputPath)
  } catch (e) {
    vscode.window.showErrorMessage(
      e instanceof Error ? e.message : 'Failed to read config file',
    )
    return null
  }

  try {
    if (outputPath === undefined) {
      const _outputPath = await inputOutputPath()

      if (!_outputPath) {
        vscode.window.showErrorMessage('No path provided.')
        return null
      }

      outputPath = _outputPath
    }

    const templates = getTemplates(outputPath)

    if (templates.length === 0) {
      vscode.window.showErrorMessage(`No templates found in ${NAME} folder`)
      return null
    }

    const selectedTemplateName = await selectTemplate(templates)

    if (!selectedTemplateName) {
      vscode.window.showErrorMessage('No template selected.')
      return null
    }

    const template = templates.find(
      (template) => template.name === selectedTemplateName,
    ) as Template

    const overwriteOptions = await confirmOverwrite(config.overwrite)

    if (!overwriteOptions) {
      vscode.window.showErrorMessage('Overwrite option input was cancelled.')
      return null
    }

    const variants = getVariantsFromTemplate(template)
    const variantsMap = await inputVariants(variants, config.variants)

    if (Object.keys(variantsMap).length !== variants.length) {
      vscode.window.showErrorMessage('Variant input was cancelled.')
      return null
    }

    generateCode({
      options: config.overwrite,
      variants: variantsMap,
      template,
      outputPath: outputPath,
    })

    vscode.window.showInformationMessage('Successfully generated code')
  } catch (e) {
    vscode.window.showErrorMessage(
      e instanceof Error ? e.message : 'Failed to generate code',
    )
  }
}
