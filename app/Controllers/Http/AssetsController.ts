import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Drive from '@ioc:Adonis/Core/Drive'
import Space from 'App/Services/Space'

export default class AssetsController {
  public async importMap({ response }: HttpContextContract) {
    response.type('application/importmap+json')

    const assets = await Space.emit('space:assets:index')

    const pages = await Space.emit('space:pages:index')

    const imports = {}

    assets.forEach((asset) => {
      imports[`assets/${asset.name}`] = `/api/v1/assets/${asset.name}`
    })

    pages.forEach((page) => {
      imports[`pages/${page.name}`] = `/api/v1/pages/${page.name}`
    })

    return {
      imports,
    }
  }

  public async show({ response, params, request }: HttpContextContract) {
    const name = request.params()['*'].join('/')

    const asset = await Space.emit('space:assets:get', name)

    if (!asset) {
      return response.notFound('Asset not found')
    }

    const exist = await Drive.exists(asset.filename)

    if (!exist) {
      return response.notFound('Asset not found')
    }

    const content = await Drive.get(asset.filename)

    response.type(path.extname(asset.filename))

    return content
  }
}
