import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Space from 'App/Services/SpaceService'

export default class ViewsController {
  public async index({ request }: HttpContextContract) {
    return Space.emit('view:index', request.qs())
  }

  public async show({ params }: HttpContextContract) {
    return Space.emit('view:show', { id: params.id })
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('view:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return Space.emit('view:update', {
      ...request.body(),
      id: params.id,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('view:destroy', params.id)

    return {
      message: 'View deleted',
    }
  }
}
