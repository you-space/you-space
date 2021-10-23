import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from '@ioc:Adonis/Core/Drive'
import { Space } from 'App/Services/SpaceService'

import { PageData } from 'App/Listeners/PageListener'

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

    response.type('js')

    if (!page) {
      return response.notFound('// page not found')
    }

    const files = page.files.map((file) => ({
      ...file,
      filename: undefined,
    }))

    return {
      ...page,
      files,
    }
  }

  public async showFile({ request, response, params }: HttpContextContract) {
    const page = await Space.emit<PageData>('page:show', params.page)

    if (!page) {
      throw new Error('Page not found')
    }

    const file = page.files.find((f) => f.name === params.file)

    if (!file) {
      throw new Error('File not found')
    }

    const exist = Drive.exists(file.filename)

    if (!exist) {
      throw new Error('File not found')
    }

    response.type(file.type === 'main' ? 'js' : file.type)

    return (await Drive.get(file.filename)).toString()
  }
}
