import * as vscode from 'vscode'
import { execute } from './execute'
import { init } from './init'

export function activate(context: vscode.ExtensionContext) {
  const generateCode = vscode.commands.registerCommand(
    'seisei.generate',
    execute,
  )

  const initConfig = vscode.commands.registerCommand('seisei.init', init)

  context.subscriptions.push(generateCode, initConfig)
}
