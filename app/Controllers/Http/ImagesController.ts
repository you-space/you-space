import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Space from 'App/Services/SpaceService'

export default class ImagesController {
  public async index({ request }: HttpContextContract) {
    return Space.emit('image:index', request.qs())
  }

  public async show({ request, response, params }: HttpContextContract) {
    return Space.emit<Image>('image:show', {
      id: params.id,
      ...request.qs(),
    })
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('image:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return Space.emit<Image>('image:update', {
      id: params.id,
      ...request.body(),
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('image:destroy', params.id)

    return {
      message: 'Image deleted',
    }
  }
}
