import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OriginService from '@ioc:Providers/OriginService'
import Video from 'App/Models/Video'

export default class CommentsController {
  public async index({ params, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (Number(page) - 1) * limit

    const video = await Video.query().preload('origin').where('id', params.video_id).firstOrFail()

    await OriginService.registerComments(video.origin, video.videoId, page)

    const comments = await video
      .related('comments')
      .query()
      .preload('user')
      .preload('replies')
      .whereNull('parentCommentId')
      .limit(limit)
      .offset(offset)

    return comments.map((c) => OriginService.serializeComment(video.origin, c))
  }
}
