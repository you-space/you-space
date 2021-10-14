import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from '@ioc:Adonis/Core/Drive'
import { Space } from 'App/Services/SpaceService'

import { parse } from '@vue/compiler-sfc'
import { PageData } from 'App/Listeners/PageListener'

function compileVueFile(content: string) {
  const { descriptor } = parse(content)

  const template = descriptor.template?.content.trim()

  let code = `export const template = \`${template}\`; \n`

  code += descriptor.script?.content.replace('export default', 'export const script = ')

  return code
}

export default class PagesController {
  public async index() {
    const pages = await Space.emit<PageData[]>('page:index')

    if (!pages) return []

    return pages.map((p) => ({
      name: p.name,
      label: p.label,
      icon: p.icon,
    }))
  }

  public async show({ params, response }: HttpContextContract) {
    const page = await Space.emit<PageData>('page:show', params.id)

    const template = `
      // Page not found
      export const template = '<y-page padding><h2>Custom page not found</h2></y-page>'
    `
    response.type('js')

    if (!page) {
      return template
    }

    const exist = await Drive.exists(page.filename)

    if (!exist) {
      return template
    }

    const file = await Drive.get(page.filename)

    const content = file.toString()

    return compileVueFile(content)
  }
}
