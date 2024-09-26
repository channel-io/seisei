import * as vscode from 'vscode'
import { execute } from './execute'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('seisei.generate', (x) => {
    execute(x)
  })

  context.subscriptions.push(disposable)
}
