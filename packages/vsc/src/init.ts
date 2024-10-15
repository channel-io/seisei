import { generateConfig } from '@channel.io/seisei-core'
import vscode from 'vscode'
import { inputOutputPath } from './prompt/inputOutputPath'

export async function init(props?: { fsPath?: string }) {
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

  generateConfig(outputPath)
}
