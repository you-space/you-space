import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentVideo from 'App/Services/Content/ContentVideos'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: Number(request.input('page', 1)),
      limit: Number(request.input('limit', 20)),
      visibility: request.input('visibility', 'public'),
    }

    return await ContentVideo.index(filter, auth.user)
  }

  public async show({ params, auth }: HttpContextContract) {
    return ContentVideo.show(params.id, auth.user)
  }
}
