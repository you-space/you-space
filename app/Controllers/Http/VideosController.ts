import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentVideo from 'App/Services/Content/ContentVideos'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: request.input('page', 1),
      limit: request.input('limit', 1),
    }

    const videos = await ContentVideo.index(filter, auth.user)

    return {
      data: videos,
      meta: {},
    }
  }

  public async show({ params, auth }: HttpContextContract) {
    return ContentVideo.show(params.id, auth.user)
  }
}
