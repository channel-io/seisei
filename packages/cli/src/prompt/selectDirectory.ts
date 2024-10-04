import { confirm } from '@inquirer/prompts'
import { CONFIG_DIRECTORY_NAME } from '@seisei/core'
import { folderSelector } from 'inquirer-folder-selector'

export async function selectDirectory(configPath: string): Promise<string> {
  let ans: string
  let _confirm = false

  do {
    ans = await folderSelector({
      basePath: configPath,
      message: `Enter path from ${configPath}:`,
      filter: ({ name }) => name !== CONFIG_DIRECTORY_NAME,
    })
    _confirm = await confirm({
      message: 'Do you want to create codes at this path?',
    })
  } while (!_confirm)

  return ans
}
