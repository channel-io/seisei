import {
  parseVariantWithCase,
  replaceVariants,
  caseStyleMap,
  VARIANT_REGEX,
} from './utils'
import { type CaseSuffix, CaseSuffixes } from './types'

describe('Case Style Utils', () => {
  describe('caseStyleMap', () => {
    it('should convert to camelCase correctly', () => {
      const camelCase = caseStyleMap[CaseSuffixes.CAMEL]
      expect(camelCase('hello_world')).toBe('helloWorld')
      expect(camelCase('hello-world')).toBe('helloWorld')
      expect(camelCase('HelloWorld')).toBe('helloWorld')
    })

    it('should convert to snake_case correctly', () => {
      const snakeCase = caseStyleMap[CaseSuffixes.SNAKE]
      expect(snakeCase('helloWorld')).toBe('hello_world')
      expect(snakeCase('hello-world')).toBe('hello_world')
      expect(snakeCase('HelloWorld')).toBe('hello_world')
    })

    it('should convert to PascalCase correctly', () => {
      const pascalCase = caseStyleMap[CaseSuffixes.PASCAL]
      expect(pascalCase('hello_world')).toBe('HelloWorld')
      expect(pascalCase('hello-world')).toBe('HelloWorld')
      expect(pascalCase('helloWorld')).toBe('HelloWorld')
    })

    it('should convert to kebab-case correctly', () => {
      const kebabCase = caseStyleMap[CaseSuffixes.KEBAB]
      expect(kebabCase('helloWorld')).toBe('hello-world')
      expect(kebabCase('hello_world')).toBe('hello-world')
      expect(kebabCase('HelloWorld')).toBe('hello-world')
    })

    it('should handle edge cases correctly', () => {
      const testCases = [
        {
          fn: caseStyleMap[CaseSuffixes.CAMEL],
          input: 'hello123World',
          expected: 'hello123World',
        },
        {
          fn: caseStyleMap[CaseSuffixes.SNAKE],
          input: 'hello123World',
          expected: 'hello123_world',
        },
        {
          fn: caseStyleMap[CaseSuffixes.PASCAL],
          input: 'hello123_world',
          expected: 'Hello123World',
        },
        {
          fn: caseStyleMap[CaseSuffixes.KEBAB],
          input: 'hello123World',
          expected: 'hello123-world',
        },
      ]

      testCases.forEach(({ fn, input, expected }) => {
        expect(fn(input)).toBe(expected)
      })
    })

    it('should handle complex words correctly', () => {
      const testCases = [
        {
          input: 'check-is-need-enterprise-guide',
          expected: {
            [CaseSuffixes.CAMEL]: 'checkIsNeedEnterpriseGuide',
            [CaseSuffixes.SNAKE]: 'check_is_need_enterprise_guide',
            [CaseSuffixes.PASCAL]: 'CheckIsNeedEnterpriseGuide',
            [CaseSuffixes.KEBAB]: 'check-is-need-enterprise-guide',
          },
        },
        {
          input: 'user_profile_image_url',
          expected: {
            [CaseSuffixes.CAMEL]: 'userProfileImageUrl',
            [CaseSuffixes.SNAKE]: 'user_profile_image_url',
            [CaseSuffixes.PASCAL]: 'UserProfileImageUrl',
            [CaseSuffixes.KEBAB]: 'user-profile-image-url',
          },
        },
        {
          input: 'apiResponseHandler',
          expected: {
            [CaseSuffixes.CAMEL]: 'apiResponseHandler',
            [CaseSuffixes.SNAKE]: 'api_response_handler',
            [CaseSuffixes.PASCAL]: 'ApiResponseHandler',
            [CaseSuffixes.KEBAB]: 'api-response-handler',
          },
        },
      ]

      testCases.forEach(({ input, expected }) => {
        Object.entries(expected).forEach(([suffix, expectedOutput]) => {
          const fn = caseStyleMap[suffix as CaseSuffix]
          expect(fn(input)).toBe(expectedOutput)
        })
      })
    })
  })

  describe('parseVariantWithCase', () => {
    it('should parse variant without suffix', () => {
      const result = parseVariantWithCase('{{variant}}')
      expect(result).toEqual({
        value: 'variant',
        suffix: undefined,
      })
    })

    it('should parse variant with suffix', () => {
      const testCases = [
        {
          input: '{{variant}cc}',
          expected: { value: 'variant', suffix: CaseSuffixes.CAMEL },
        },
        {
          input: '{{variant}sc}',
          expected: { value: 'variant', suffix: CaseSuffixes.SNAKE },
        },
        {
          input: '{{variant}pc}',
          expected: { value: 'variant', suffix: CaseSuffixes.PASCAL },
        },
        {
          input: '{{variant}kc}',
          expected: { value: 'variant', suffix: CaseSuffixes.KEBAB },
        },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(parseVariantWithCase(input)).toEqual(expected)
      })
    })

    it('should handle invalid formats', () => {
      const testCases = [
        'variant',
        '{{variant',
        'variant}}',
        '{{variant}}invalid',
      ]

      testCases.forEach((input) => {
        const result = parseVariantWithCase(input)
        expect(result).toEqual({ value: input })
      })
    })
  })

  describe('replaceVariants', () => {
    it('should replace variants without case conversion', () => {
      const template = 'Hello {{name}}, welcome to {{place}}'
      const variants = {
        name: 'John',
        place: 'Seoul',
      }

      expect(replaceVariants(template, variants)).toBe(
        'Hello John, welcome to Seoul',
      )
    })

    it('should replace variants with case conversion', () => {
      const template = 'const {{name}cc} = new {{type}pc}()'
      const variants = {
        name: 'hello_world',
        type: 'test_component',
      }

      expect(replaceVariants(template, variants)).toBe(
        'const helloWorld = new TestComponent()',
      )
    })

    it('should handle missing variants', () => {
      const template = '{{exists}} {{missing}}'
      const variants = { exists: 'value' }

      expect(replaceVariants(template, variants)).toBe('value missing')
    })

    it('should handle multiple case conversions', () => {
      const template = `
        import { {{name}pc} } from './components'

        const {{name}cc} = new {{name}pc}()
        export const {{name}sc} = {{name}cc}
      `.trim()

      const variants = { name: 'hello_world' }

      expect(replaceVariants(template, variants)).toBe(
        `
        import { HelloWorld } from './components'

        const helloWorld = new HelloWorld()
        export const hello_world = helloWorld
      `.trim(),
      )
    })
  })
})

describe('VARIANT_REGEX', () => {
  it('should match basic variable patterns', () => {
    const testCases = [
      {
        input: '{{variable}}',
        expected: [['{{variable}}', 'variable', undefined]],
      },
      {
        input: '{{myVar}cc}',
        expected: [['{{myVar}cc}', 'myVar', 'cc']],
      },
      {
        input: '{{snake_case}sc}',
        expected: [['{{snake_case}sc}', 'snake_case', 'sc']],
      },
      {
        input: '{{kebab-case}kc}',
        expected: [['{{kebab-case}kc}', 'kebab-case', 'kc']],
      },
      {
        input: '{{PascalCase}pc}',
        expected: [['{{PascalCase}pc}', 'PascalCase', 'pc']],
      },
    ]

    testCases.forEach(({ input, expected }) => {
      const matches = [...input.matchAll(VARIANT_REGEX)]
      expect(matches.map((match) => Array.from(match))).toEqual(expected)
    })
  })

  it('should match multiple variables in a string', () => {
    const input = 'const {{name}} = new {{Type}pc}({{param}cc});'
    const expected = [
      ['{{name}}', 'name', undefined],
      ['{{Type}pc}', 'Type', 'pc'],
      ['{{param}cc}', 'param', 'cc'],
    ]

    const matches = [...input.matchAll(VARIANT_REGEX)]
    expect(matches.map((match) => Array.from(match))).toEqual(expected)
  })

  it('should handle nested curly braces', () => {
    const testCases = [
      {
        input: '{{{variable}}}',
        expected: [['{{variable}}', 'variable', undefined]],
      },
      {
        input: '{{{myVar}cc}}',
        expected: [['{{myVar}cc}', 'myVar', 'cc']],
      },
      {
        input: '{{{{PascalCase}pc}}}',
        expected: [['{{PascalCase}pc}', 'PascalCase', 'pc']],
      },
    ]

    testCases.forEach(({ input, expected }) => {
      const matches = [...input.matchAll(VARIANT_REGEX)]
      expect(matches.map((match) => Array.from(match))).toEqual(expected)
    })
  })

  it('should not match invalid patterns', () => {
    const invalidPatterns = [
      '{{}}', // 빈 변수
      '{{ }}', // 공백만 있는 경우
      '{{ value }}', // 공백이 포함된 변수명
      '{{123var}}', // 숫자로 시작하는 변수명
      '{{var!name}}', // 특수문자가 포함된 변수명
      '{{var}invalid}', // 잘못된 suffix
      '{{var-name_mixed}cc}', // 혼합된 케이스 스타일
      '{{ value: true }}', // 객체 형태
    ]

    invalidPatterns.forEach((pattern) => {
      const matches = [...pattern.matchAll(VARIANT_REGEX)]
      expect(matches).toHaveLength(0)
    })
  })
})
