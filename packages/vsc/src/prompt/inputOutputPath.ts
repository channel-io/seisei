import * as vscode from 'vscode'

export async function inputOutputPath(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    prompt: 'Enter the path to the template folder',
    placeHolder: 'e.g., /path/to/.vscode/.template',
  })
}
