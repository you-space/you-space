import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Space from 'App/Services/SpaceService'

export default class CommentsController {
  public index({ request }: HttpContextContract) {
    return Space.emit('comment:index', request.qs())
  }

  public show({ params }: HttpContextContract) {
    return Space.emit('comment:show', {
      id: params.id,
    })
  }

  public store({ request }: HttpContextContract) {
    return Space.emit('comment:store', request.body())
  }

  public update({ params, request }: HttpContextContract) {
    return Space.emit('comment:update', {
      ...request.body(),
      id: params.id,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('comment:destroy', params.id)

    return {
      message: 'Comment deleted',
    }
  }
}
