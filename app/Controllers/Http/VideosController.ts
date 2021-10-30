import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import Video from 'App/Models/Video'
import Space from 'App/Services/SpaceService'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    return Space.emit('video:index', request.qs())
  }

  public async show({ request, params }: HttpContextContract) {
    return Space.emit('video:show', {
      ...request.qs(),
      id: params.id,
    })
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('video:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return Space.emit('video:update', {
      ...request.body(),
      id: params.id,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('video:destroy', params.id)

    return {
      message: 'Video deleted ',
    }
  }
}
