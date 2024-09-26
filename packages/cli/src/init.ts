import { NAME, generateConfig } from '@seisei/core'

export function init() {
  try {
    generateConfig()
    console.log('The _seisei config folder was successfully created.')
  } catch {
    console.error('Failed to generate config. Check these things:')
    console.error(
      `- There should be no ${NAME} directory in the current directory`,
    )
    console.error(`- There should be no config.json file in ${NAME} directory`)
  }
}
