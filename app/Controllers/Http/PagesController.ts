import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Page } from 'start/events/space:pages:create'

import Drive from '@ioc:Adonis/Core/Drive'
import Space from 'App/Services/Space'

import { parse } from '@vue/compiler-sfc'

function compileVueFile(content: string) {
  const { descriptor } = parse(content)

  const template = descriptor.template?.content.trim()

  let code = `export const template = \`${template}\`; \n`

  code += descriptor.script?.content.replace('export default', 'export const script = ')

  return code
}

export default class PagesController {
  public async index() {
    const pages = await Space.emit('space:pages:index')

    return pages.map((p) => ({
      name: p.name,
      label: p.label,
      icon: p.icon,
    }))
  }

  public async show({ params, response }: HttpContextContract) {
    const page = await Space.emit<Page>('space:pages:get', params.id)

    if (!page) {
      return response.notFound('// Page not found')
    }

    const exist = await Drive.exists(page.filename)

    if (!exist) {
      return response.notFound('// Page filename not found')
    }

    const file = await Drive.get(page.filename)

    const content = file.toString()

    response.type('js')

    return compileVueFile(content)
  }
}
