import { CONFIG_DIRECTORY_NAME, generateConfig } from '@channel.io/seisei-core'

export function init() {
  try {
    generateConfig()
    console.log('The _seisei config folder was successfully created.')
  } catch {
    console.error('Failed to generate config. Check these things:')
    console.error(
      `- There should be no ${CONFIG_DIRECTORY_NAME} directory in the current directory`,
    )
    console.error(
      `- There should be no config.json file in ${CONFIG_DIRECTORY_NAME} directory`,
    )
  }
}
