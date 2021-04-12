import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentService from '@ioc:Providers/ContentService'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: Number(request.input('page', 1)),
      limit: Number(request.input('limit', 20)),
      visibility: request.input('visibility', 'public'),
    }

    return await ContentService.index(filter, auth.user)
  }

  public async show({ params, auth }: HttpContextContract) {
    return ContentService.show(params.id, auth.user)
  }
}
