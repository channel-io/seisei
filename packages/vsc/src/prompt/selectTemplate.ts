import type { Template } from '@channel.io/seisei-core'
import * as vscode from 'vscode'

export async function selectTemplate(
  templates: Template[],
): Promise<string | undefined> {
  return vscode.window.showQuickPick(
    templates.map(({ name }) => name),
    {
      title: 'Select a template',
    },
  )
}
