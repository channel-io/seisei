import type { Config } from '@channel.io/seisei-core'
import * as vscode from 'vscode'

type VariantsMap = Config['variants']

export async function inputVariants(
  variants: string[],
  defaultVariantsMap?: VariantsMap,
): Promise<VariantsMap> {
  const variantsMap: VariantsMap = { ...defaultVariantsMap }

  for (const variant of variants) {
    const userInput = await vscode.window.showInputBox({
      prompt: `Enter a value for ${variant}`,
      placeHolder: variantsMap[variant],
    })

    if (userInput === undefined) {
      return {}
    }

    if (userInput !== '') {
      variantsMap[variant] = userInput
    }
  }

  return variantsMap
}
