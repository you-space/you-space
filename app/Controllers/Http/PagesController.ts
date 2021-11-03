import { pick } from 'lodash'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'

import { Page } from 'App/Listeners/PageListener'
import Space from 'App/Services/SpaceService'

export default class PagesController {
  public async index() {
    const pages = await Space.emit<Page[]>('page:index')

    return {
      meta: { total: pages?.length },
      data: pages?.map((p) => pick(p, ['id', 'title'])),
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const page = await Space.emit<Page>('page:show', Number(params.id))

    if (!page) {
      return response.notFound({
        message: 'Page not found',
      })
    }

    const exist = await Drive.exists(page.filename)

    if (!exist) {
      return response.notFound({
        message: 'Page not found',
      })
    }

    const content = await Drive.get(page.filename)

    response.type('js')

    return content.toString()
  }
}
