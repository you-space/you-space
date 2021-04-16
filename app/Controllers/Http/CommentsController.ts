import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentService from '@ioc:Providers/ContentService'
import OriginService from '@ioc:Providers/OriginService'
import EntityItem from 'App/Models/EntityItem'

export default class CommentsController {
  public async index({ params, request, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const allowedVisibilities = await ContentService.getUserAllowedVisibilities(auth.user)

    const video = await EntityItem.query()
      .preload('origin')
      .where('id', params.video_id)
      .whereIn(
        'visibility_id',
        allowedVisibilities.map((v) => v.id)
      )
      .firstOrFail()

    await OriginService.importComments(video.origin, video, Number(page))

    const paginator = await video.related('child').query().preload('child').paginate(page, limit)

    const data = paginator.all().map((item) => {
      const comment = OriginService.serializeComment(video.origin, item)
      let replies = item.child.map((child) => OriginService.serializeComment(video.origin, child))

      return {
        ...comment,
        replies,
      }
    })

    return {
      data,
      meta: paginator.getMeta(),
    }
  }
}
