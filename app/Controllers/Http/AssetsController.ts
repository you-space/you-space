import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import SystemMeta from 'App/Models/SystemMeta'
import Drive from '@ioc:Adonis/Core/Drive'

export default class AssetsController {
  public async importMap({ response }: HttpContextContract) {
    response.type('application/importmap+json')

    const metas = await SystemMeta.fetchByName('assets:*')

    const imports = {}
    metas
      .map((meta) => meta.name.replace('assets:', ''))
      .forEach((name) => {
        imports[name] = `/api/v1/assets/${name}`
      })

    return {
      imports,
    }
  }

  public async show({ response, params, request }: HttpContextContract) {
    const name = request.params()['*'].join('/')

    const meta = await SystemMeta.fetchByName(`assets:${name}`).first()

    if (!meta) {
      return response.notFound('Asset not found')
    }

    const exist = await Drive.exists(meta.value)

    if (!exist) {
      return response.notFound('Asset not found')
    }

    const content = await Drive.get(meta.value)

    response.type(path.extname(meta.value))

    return content
  }
}
