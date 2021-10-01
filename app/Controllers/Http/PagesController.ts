import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Page } from 'start/events/space:pages:create'

import Drive from '@ioc:Adonis/Core/Drive'
import Space from 'App/Services/Space'

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
      return response.notFound('Page not found')
    }

    return {
      ...page,
      template: undefined,
      script: undefined,
      styles: undefined,
    }
  }

  public async showTemplate({ params, response }: HttpContextContract) {
    const page = await Space.emit<Page>('space:pages:get', params.id)

    if (!page) {
      return response.notFound('Page not found')
    }

    const exist = await Drive.exists(page.template)

    if (!exist) {
      return response.notFound('Page template not found')
    }

    const file = await Drive.get(page.template)

    const content = file.toString()

    response.type('html')

    return content
  }

  public async showScript({ params, response }: HttpContextContract) {
    const page = await Space.emit<Page>('space:pages:get', params.id)

    if (!page) {
      return response.notFound('Page not found')
    }

    if (!page.script) {
      return '// no script'
    }

    const exist = await Drive.exists(page.script)

    if (!exist) {
      return response.notFound('Page script not found')
    }

    const file = await Drive.get(page.script)

    const content = file.toString()

    response.type('js')

    return content
  }

  public async showStyles({ params, response }: HttpContextContract) {
    const page = await Space.emit<Page>('space:pages:get', params.id)

    if (!page) {
      return response.notFound('Page not found')
    }

    if (!page.styles) {
      return '/* no styles */'
    }

    const exist = await Drive.exists(page.styles)

    if (!exist) {
      return response.notFound('Page styles not found')
    }

    const file = await Drive.get(page.styles)

    const content = file.toString()

    response.type('css')

    return content
  }
}
