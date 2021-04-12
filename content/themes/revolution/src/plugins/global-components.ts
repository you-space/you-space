import { BootArgs } from '@/types'
import { upperFirst, camelCase, uniq } from 'lodash'
const getComponentName = (filename: string) => {
  const name = upperFirst(
    camelCase(
      filename
        .replace(/^\.\//, '')
        .replace(/\.\w+$/, '')
        .replace('index', '')
    )
  )
  const duplicates = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')

  if (duplicates.length > 1) {
    return uniq(duplicates).join('')
  }

  return duplicates.join('')
}

export default function ({ app }: BootArgs) {
  const context = require.context('@/components', true, /\.(ts|vue)$/)
  const fileNames = context.keys()
  const componentsLoaded: string[] = []

  fileNames.forEach((filename) => {
    const component = context(filename)

    const componentName = getComponentName(filename)

    if (componentsLoaded.includes(componentName)) {
      return
    }

    componentsLoaded.push(componentName)

    app.component(componentName, component.default || component)
  })
}
