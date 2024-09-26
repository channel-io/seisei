import { input } from '@inquirer/prompts'
import type { Config } from 'seisei-core'

type VariantsMap = Config['variants']

export const inputVariants = async (
  variants: string[],
  defaultVariantMap: VariantsMap = {},
): Promise<VariantsMap> => {
  const result: VariantsMap = { ...defaultVariantMap }

  for (const variant of variants) {
    result[variant] = await input({
      message: `Enter value for ${variant}:`,
      default: result[variant],
      required: true,
      validate: (value) => value.trim() !== '',
    })
  }

  return result
}
