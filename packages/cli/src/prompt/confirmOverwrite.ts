import { confirm } from '@inquirer/prompts'
import type { Config } from '@seisei/core'

type OverwriteOptions = Config['overwrite']

export async function confirmOverwrite(
  options: Partial<OverwriteOptions> = {},
): Promise<OverwriteOptions> {
  const { directory = false, file = false } = options

  const _directory = await confirm({
    message:
      'Overwrite the directory? If true, existing folder may be overwritten, and its contents deleted.',
    default: directory,
  })

  const _file = await confirm({
    message:
      'Overwrite the file? If true, existing folder may be overwritten, and its contents deleted.',
    default: file,
  })

  return {
    directory: _directory,
    file: _file,
  }
}
