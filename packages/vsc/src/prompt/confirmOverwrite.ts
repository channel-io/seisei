import type { Config } from '@channel.io/seisei-core'
import * as vscode from 'vscode'

type OverwriteOptions = Config['overwrite']

const booleanToYesNo = (value: boolean): string => (value ? 'Y' : 'N')

const yesNoToBoolean = (value: string): boolean => /^(y|yes)/i.test(value)

export async function confirmOverwrite(
  options: Partial<OverwriteOptions> = {},
): Promise<OverwriteOptions | null> {
  const { directory = false, file = false } = options

  const _directory = await vscode.window.showInputBox({
    prompt:
      'Overwrite the directory? If true, existing folder may be overwritten, and its contents deleted.',
    placeHolder: booleanToYesNo(directory),
  })

  const _file = await vscode.window.showInputBox({
    prompt:
      'Overwrite the file? If true, existing folder may be overwritten, and its contents deleted.',
    placeHolder: booleanToYesNo(file),
  })

  if (_directory === undefined || _file === undefined) {
    return null
  }

  return {
    directory: yesNoToBoolean(_directory),
    file: yesNoToBoolean(_file),
  }
}
