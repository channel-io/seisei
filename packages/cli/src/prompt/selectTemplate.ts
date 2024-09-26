import { search } from '@inquirer/prompts'
import type { Template } from 'seisei-core'

export async function selectTemplate(
  templates: Template[] = [],
): Promise<Template> {
  const _templates = templates.map((template) => ({
    name: template.name,
    value: template,
  }))

  return search<Template>({
    message: 'Select a template: ',
    source: (input = '') => {
      if (!input) return _templates
      return _templates.filter((template) => template.name.includes(input))
    },
  })
}
