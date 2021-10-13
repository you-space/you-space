import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Space from 'App/Services/Space'
export default class ItemsController {
  public async index({ request }: HttpContextContract) {
    const payload = request.qs()

    return Space.emit('item:index', payload)
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('item:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return await Space.emit('item:update', {
      id: params.id,
      ...request.body(),
    })
  }
}
