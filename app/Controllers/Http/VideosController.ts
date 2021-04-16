import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentService from '@ioc:Providers/ContentService'
import EntityItem from 'App/Models/EntityItem'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: Number(request.input('page', 1)),
      limit: Number(request.input('limit', 20)),
      visibility: request.input('visibility', undefined),
      originId: request.input('originId', undefined),
      search: request.input('search', undefined),
    }

    return await ContentService.index(filter, auth.user)
  }

  public async show({ params, auth }: HttpContextContract) {
    const allowedVisibilities = await ContentService.getUserAllowedVisibilities(auth.user)

    const video = await EntityItem.query()
      .preload('visibility')
      .preload('origin')
      .where('id', params.id)
      .whereIn(
        'visibility_id',
        allowedVisibilities.map((v) => v.id)
      )
      .firstOrFail()

    return ContentService.getVideoFields(video)
  }
}
