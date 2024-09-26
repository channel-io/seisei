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
import { inputOutputPath } from './prompt/inputOutputPath'
import { inputVariants } from './prompt/inputVariants'
import { selectTemplate } from './prompt/selectTemplate'

export async function execute(props?: { fsPath?: string }) {
  let config: Config
  try {
    config = readConfigFile()
  } catch (e) {
    console.error(e instanceof Error ? e.message : 'Failed to read config file')
    return
  }

  let outputPath = props?.fsPath
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length < 1
  ) {
    vscode.window.showErrorMessage('please open a workspace first')
    return null
  }

  if (outputPath === undefined) {
    const _outputPath = await inputOutputPath()

    if (!_outputPath) {
      vscode.window.showErrorMessage('No path provided.')
      return null
    }

    outputPath = _outputPath
  }

  const templates = getTemplates()

  if (templates.length === 0) {
    vscode.window.showInformationMessage(`No templates found in ${NAME} folder`)
    return null
  }

  const selectedTemplateName = await selectTemplate(templates)

  if (!selectedTemplateName) {
    vscode.window.showInformationMessage('No template selected.')
    return null
  }

  const template = templates.find(
    (template) => template.name === selectedTemplateName,
  ) as Template

  const variants = getVariantsFromTemplate(template)
  const variantsMap = await inputVariants(variants, config.variants)

  if (Object.keys(variantsMap).length !== variants.length) {
    vscode.window.showWarningMessage('Variant input was cancelled.')
    return null
  }

  generateCode({
    options: config.overwrite,
    variants: variantsMap,
    template,
    outputPath: outputPath,
  })

  vscode.window.showInformationMessage(
    'Placeholders replaced successfully in files and folder names.',
  )
}
